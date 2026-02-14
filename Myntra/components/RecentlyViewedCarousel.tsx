import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getRecentlyViewed, Product } from '@/utils/recentlyViewed';

export default function RecentlyViewedCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        getRecentlyViewed().then(setProducts);
    }, []);

    if (products.length === 0) return null;

    return (
        <View style={{ marginVertical: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
                Recently Viewed
            </Text>

            <FlatList
                horizontal
                data={products}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/product/${item._id}`)}
                        style={{ marginRight: 12 }}
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 120, height: 160, borderRadius: 8 }}
                        />
                        <Text numberOfLines={1} style={{ width: 120 }}>
                            {item.title}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
