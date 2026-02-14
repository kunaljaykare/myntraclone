import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;

export type Product = {
    _id: string;
    title: string;
    image: string;
    price: number;
};

export const getRecentlyViewed = async (): Promise<Product[]> => {
    const data = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
};

export const addRecentlyViewed = async (product: Product) => {
    const items = await getRecentlyViewed();

    // remove duplicate
    const filtered = items.filter(item => item._id !== product._id);

    // add newest at top
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);

    await AsyncStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(updated)
    );
};
