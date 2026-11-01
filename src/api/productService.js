// Remote Products API Service (Separation of Concerns)
const PRIMARY_API_URL = process.env.EXPO_PUBLIC_PRODUCTS_API_URL || 'https://fakestoreapi.com/products';
const FALLBACK_API_URL = 'https://dummyjson.com/products?limit=20';

// Dữ liệu dự phòng offline (Offline Backup) đảm bảo app luôn hiển thị được SP khi mất mạng hoàn toàn
const BACKUP_PRODUCTS = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop in the padded sleeve.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    price: 15.99,
    description: 'The color could be slightly different between on the screen and in practice. Hand wash recommended.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png',
    rating: { rate: 2.1, count: 430 },
  },
  {
    id: 5,
    title: 'John Hardy Women Legends Naga Gold Bracelet',
    price: 695.0,
    description: 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: 'Solid Gold Petite Micropave',
    price: 168.0,
    description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold exclusively.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png',
    rating: { rate: 3.9, count: 70 },
  },
];

/**
 * Lấy danh sách sản phẩm
 * Thứ tự ưu tiên: FakeStoreAPI -> DummyJSON -> Offline Backup
 */
export const fetchProducts = async () => {
  // 1. Thử gọi FakeStoreAPI (Không dùng AbortController để tránh lỗi cancel trên React Native)
  try {
    const response = await fetch(PRIMARY_API_URL);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return { data, error: null };
      }
    }
  } catch (err1) {
    console.warn('FakeStoreAPI thất bại, chuyển sang DummyJSON:', err1.message);
  }

  // 2. Fallback sang DummyJSON nếu FakeStoreAPI bị chặn mạng hoặc lỗi
  try {
    const response = await fetch(FALLBACK_API_URL);
    if (response.ok) {
      const json = await response.json();
      if (json && Array.isArray(json.products) && json.products.length > 0) {
        // Chuẩn hóa định dạng DummyJSON về cấu trúc chung
        const mapped = json.products.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.thumbnail || item.images?.[0] || '',
          rating: { rate: item.rating || 4.5, count: item.stock || 50 },
        }));
        return { data: mapped, error: null };
      }
    }
  } catch (err2) {
    console.warn('DummyJSON cũng thất bại:', err2.message);
  }

  // 3. Nếu cả 2 đều mất mạng hoàn toàn, dùng Offline Backup để người dùng vẫn xem và test app được
  return {
    data: BACKUP_PRODUCTS,
    error: null,
  };
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${PRIMARY_API_URL}/${id}`);
    if (response.ok) {
      const data = await response.json();
      return { data, error: null };
    }
  } catch (e) {
    console.warn('Lỗi fetchProductById:', e.message);
  }

  const localItem = BACKUP_PRODUCTS.find((p) => p.id === Number(id));
  return { data: localItem || null, error: null };
};
