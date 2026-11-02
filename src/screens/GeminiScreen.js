import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { fetchProducts } from '../api/productService';
import { askGeminiForRecommendation } from '../services/geminiService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { triggerLocalNotification } from '../services/notificationService';

const SAMPLE_PROMPTS = [
  'Gợi ý 2 sản phẩm phù hợp cho học sinh cấp 3',
  'Tư vấn quà tặng giá tốt dưới $50',
  'Gợi ý sản phẩm thời trang nữ thanh lịch',
];

export default function GeminiScreen({ onSelectProduct }) {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Tải danh mục sản phẩm làm Context thực tế
  useEffect(() => {
    const initCatalog = async () => {
      const { data } = await fetchProducts();
      if (data) {
        setCatalog(data);
      }
    };
    initCatalog();
  }, []);

  const handleAskAI = async (promptText) => {
    const textToSend = promptText || query;
    if (!textToSend.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await askGeminiForRecommendation(textToSend, catalog);
    setResult(res);
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    triggerLocalNotification(
      'Giỏ hàng',
      `Đã thêm gợi ý "${product.title.slice(0, 25)}..." vào giỏ!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤖 Gemini AI Assistant</Text>
          <Text style={styles.subtitle}>
            Tư vấn sản phẩm thông minh dựa trên context kho hàng thực tế
          </Text>
        </View>

        {/* Gợi ý mẫu */}
        <Text style={styles.sectionLabel}>Câu hỏi gợi ý nhanh:</Text>
        <View style={styles.quickPromptsContainer}>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickPromptBadge}
              onPress={() => {
                setQuery(prompt);
                handleAskAI(prompt);
              }}
            >
              <Text style={styles.quickPromptText}>💡 {prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Text Box */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Nhập nhu cầu của bạn (ví dụ: cần balo đi học bền đẹp)..."
            value={query}
            onChangeText={setQuery}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.disabledBtn]}
            onPress={() => handleAskAI(query)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Hỏi Gemini AI</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Kết quả phản hồi từ Gemini */}
        {result && (
          <View style={styles.resultContainer}>
            {/* Validation Banner */}
            {!result.success ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>
                  ⚠️ {result.explanation}
                </Text>
              </View>
            ) : result.isHallucinated ? (
              <View style={styles.warningBanner}>
                <Text style={styles.warningText}>
                  ⚠️ Phát hiện AI gợi ý sản phẩm không khớp kho. Đã kích hoạt
                  Fallback UI để hiển thị sản phẩm thực tế!
                </Text>
              </View>
            ) : (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>
                  ✅ Đã xác thực output: Sản phẩm hoàn toàn tồn tại trong API
                </Text>
              </View>
            )}

            {/* AI Explanation */}
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>Lời giải thích từ AI:</Text>
              <Text style={styles.explanationText}>{result.explanation}</Text>
            </View>

            {/* Sản phẩm được gợi ý */}
            <Text style={styles.sectionLabel}>Sản phẩm phù hợp được chọn:</Text>
            {result.recommendedProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={isInWishlist(product.id)}
                onToggleFavorite={() => toggleWishlist(product)}
                onAddToCart={() => handleAddToCart(product)}
                onPress={() => onSelectProduct && onSelectProduct(product)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 10,
  },
  quickPromptsContainer: {
    marginBottom: 10,
  },
  quickPromptBadge: {
    backgroundColor: '#e8f0fe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#d2e3fc',
  },
  quickPromptText: {
    fontSize: 12,
    color: '#1a73e8',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginTop: 6,
  },
  input: {
    fontSize: 13,
    color: '#333',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: '#90caf9',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 16,
  },
  errorBanner: {
    backgroundColor: '#fce8e6',
    borderLeftWidth: 4,
    borderLeftColor: '#d93025',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#c5221f',
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: '#e6f4ea',
    borderLeftWidth: 4,
    borderLeftColor: '#34a853',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  successText: {
    fontSize: 12,
    color: '#137333',
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#fef7e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f9ab00',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 12,
    color: '#b06000',
    fontWeight: '600',
  },
  explanationBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
});
