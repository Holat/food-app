import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ChevronLeftIcon,
  ClockIcon,
  FireIcon,
} from "react-native-heroicons/outline";
import {
  HeartIcon,
  UsersIcon,
  Square3Stack3DIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/loading";
import YoutubeIframe from "react-native-youtube-iframe";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import RecipeTag from "../components/recipeTag";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const RecipeDetailsScreen = (props) => {
  let item = props.route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealData(item.idMeal);
  }, []);

  const getMealData = async (id) => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setLoading(false);
      }
    } catch (err) {
      console.log("error :", err.message);
    }
  };

  const ingredientsIndexes = (meal) => {
    if (!meal) return [];
    let indexes = [];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style={"light"} />

      {/* recipe image */}
      <View className="flex-row justify-center">
        <AnimatedImage
          sharedTransitionTag={item.strMeal}
          source={{ uri: item.strMealThumb }}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 10,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>

      {/* back button */}
      <Animated.View
        entering={FadeIn.delay(200).duration(100)}
        className="w-full absolute flex-row justify-between items-center pt-14"
      >
        <TouchableOpacity
          className="p-2 rounded-full ml-5 bg-white"
          onPress={() => props.navigation.goBack()}
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          className="p-2 rounded-full mr-5 bg-white"
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* meal description */}
      {loading ? (
        <Loading size="large" className="mt-16" color="#fbbf24" />
      ) : (
        <View className="px-4 flex justify-between space-y-4 pt-8">
          {/* name and area */}
          <Animated.View
            entering={FadeInDown.duration(700).springify().damping(12)}
            className="space-y-2"
          >
            <Text
              style={{ fontSize: hp(3) }}
              className="font-bold flex-1 text-neutral-700"
            >
              {meal?.strMeal}
            </Text>
            <Text
              style={{ fontSize: hp(2) }}
              className="font-medium flex-1 text-neutral-500"
            >
              {meal?.strArea}
            </Text>
          </Animated.View>
          {/* misc */}
          <Animated.View
            entering={FadeInDown.delay(100)
              .duration(700)
              .springify()
              .damping(12)}
            className="flex-row justify-around"
          >
            <RecipeTag
              number={"35"}
              title={"Mins"}
              icon={
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeTag
              number={"03"}
              title={"Serving"}
              icon={
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
              }
            />
            <RecipeTag
              number={"103"}
              title={"Cal"}
              icon={<FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
            />
            <RecipeTag
              number={""}
              title={"Easy"}
              icon={
                <Square3Stack3DIcon
                  size={hp(4)}
                  strokeWidth={2.5}
                  color="#525252"
                />
              }
            />
          </Animated.View>
          {/* ingredients */}
          <Animated.View
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
            className="space-y-4"
          >
            <Text
              style={{ fontSize: hp(2.5) }}
              className="flex-1 font-bold text-neutral-700"
            >
              Ingredients
            </Text>
            <View className="space-y-2 ml-3">
              {ingredientsIndexes(meal).map((i) => {
                return (
                  <View key={i} className="flex-row space-x-4">
                    <View
                      style={{ height: hp(1.5), width: hp(1.5) }}
                      className="bg-amber-300 rounded-full"
                    />
                    <View className="flex-row space-x-2">
                      <Text
                        style={{ fontSize: hp(1.7) }}
                        className="font-extrabold text-neutral-700"
                      >
                        {meal[`strMeasure${i}`]}
                      </Text>
                      <Text
                        style={{ fontSize: hp(1.7) }}
                        className="font-medium text-neutral-600"
                      >
                        {meal[`strIngredient${i}`]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>
          {/* Instruction */}
          <Animated.View
            entering={FadeInDown.delay(300)
              .duration(700)
              .springify()
              .damping(12)}
            className="space-y-4"
          >
            <Text
              style={{ fontSize: hp(2.5) }}
              className="flex-1 font-bold text-neutral-700"
            >
              Instruction
            </Text>
            <Text style={{ fontSize: hp(1.6) }} className="text-neutral-700">
              {meal?.strInstructions}
            </Text>
          </Animated.View>
          {/* recipe video */}
          {meal.strYoutube && (
            <Animated.View
              entering={FadeInDown.delay(400)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className="flex-1 font-bold text-neutral-700"
              >
                Recipe video
              </Text>
              <View>
                <YoutubeIframe
                  videoId={getYoutubeVideoId(meal.strYoutube)}
                  height={hp(30)}
                />
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </ScrollView>
  );
};
export default RecipeDetailsScreen;
