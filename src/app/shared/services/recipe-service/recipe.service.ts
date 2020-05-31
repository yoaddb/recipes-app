import { ShoppingListService } from './../shopping-list-service/shopping-list.service';
import { Injectable } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { Ingredient } from '../../models/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  setRecipes(recipes:Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipeById(id: string): Recipe {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: string, recipe: Recipe) {
    this.recipes = this.recipes.map((r: Recipe) =>
      r.id === id ? { ...recipe } : r
    );
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: string) {
    const index = this.recipes.findIndex((recipe: Recipe) => recipe.id === id);
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
