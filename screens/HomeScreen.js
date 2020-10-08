import React, { useState, useEffect } from 'react';
import { Button, Text, Image } from 'react-native';
import { Card, CardItem, Container, Content } from 'native-base';
import TheMealDb from '../api/TheMealDb';
import Realm from 'realm';
import { RecipeSchema } from '../database/RecipeSchema';
import { useDispatch, useSelector } from 'react-redux';

const HomeScreen = ({ navigation }) => {
  const { recipeApi, isLoading } = useSelector(
    ({ recipeApiReducer }) => recipeApiReducer,
  );
  const dispatch = useDispatch();

  const getRecipeOfTheDay = async () => {
    await TheMealDb.get('/random.php')
      .then((response) => {
        dispatch({ type: 'API_GET_RECIPE', payload: response.data.meals[0] });
      })
      .catch((e) => {
        alert(e);
      });
  };

  const viewDatabase = async () => {
    await Realm.open({
      schema: [RecipeSchema],
    })
      .then((realm) => {
        {
          for (let p of realm.objects('Recipe')) {
            console.log(p);
          }
        }
        realm.close();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const clearDatabase = async () => {
    await Realm.open({
      schema: [RecipeSchema],
    })
      .then((realm) => {
        realm.write(() => {
          realm.delete(realm.objects('Recipe'));
        });
        realm.close();
        console.log('Database cleared!');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getRecipeOfTheDay();
  }, []);

  return (
    <Container>
      <Content padder>
        <Text>Recipe of the day</Text>
        <Card>
          <CardItem
            cardBody
            button
            bordered
            style={{
              flexDirection: 'column',
            }}
            onPress={() =>
              navigation.navigate('RecipeDetails', {
                recipe: recipeApi,
                toggleSave: true,
              })
            }>
            <Image
              source={{ uri: recipeApi.strMealThumb }}
              style={{ width: '100%', height: 200 }}
            />
            <Text>{recipeApi.strMeal}</Text>
          </CardItem>
        </Card>
        <Text>Powered by TheMealDB</Text>
        <Button title="Get new recipe" onPress={() => getRecipeOfTheDay()} />
        <Button title="View database" onPress={() => viewDatabase()} />
        <Button title="Clear database" onPress={() => clearDatabase()} />
        <Button
          title="Add custom recipe"
          onPress={() =>
            navigation.navigate('AddNewRecipe', {
              recipeToEdit: [],
              editRecipe: false,
            })
          }
        />
        <Button
          title="Recipe list"
          onPress={() =>
            navigation.navigate('RecipeList', { toggleSave: false })
          }
        />
      </Content>
    </Container>
  );
};

export default HomeScreen;
