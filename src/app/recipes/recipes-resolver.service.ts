import { DataStorageService } from './../shared/services/data-storage-service/data-storage.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Recipe } from '../shared/models/recipe.model';
import { Observable } from 'rxjs';
import { RecipeService } from '../shared/services/recipe-service/recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length) {
      return recipes;
    }
    return this.dataStorageService.fetchRecipes();
  }
}
