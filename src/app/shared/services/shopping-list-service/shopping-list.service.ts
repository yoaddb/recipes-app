import { Injectable } from '@angular/core';
import { Ingredient } from '../../models/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<string>();
  private ingredients: Ingredient[] = [];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredientById(id: string): Ingredient {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  updateIngredient(ingredient: Ingredient) {
    this.ingredients = this.ingredients.map((i: Ingredient) =>
      i.id === ingredient.id ? ingredient : i
    );
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(id: string) {
    this.ingredients = this.ingredients.filter(
      (ingredient: Ingredient) => ingredient.id !== id
    );
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
