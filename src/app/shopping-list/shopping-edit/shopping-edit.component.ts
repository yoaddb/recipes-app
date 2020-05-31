import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/models/ingredient.model';
import { ShoppingListService } from 'src/app/shared/services/shopping-list-service/shopping-list.service';
import { NgForm } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  subscription: Subscription;
  editMode = false;
  id: string;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (id: string) => {
        this.editMode = true;
        const { name, amount } = this.shoppingListService.getIngredientById(id);
        this.form.setValue({ name, amount });
        this.id = id;
      }
    );
  }

  onSaveItem(form: NgForm) {
    const { name, amount } = form.value;
    if (!this.editMode)
      this.shoppingListService.addIngredient(
        new Ingredient(uuid(), name, amount)
      );
    else
      this.shoppingListService.updateIngredient(
        new Ingredient(this.id, name, amount)
      );
    this.onReset();
  }

  onReset() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.onReset();
    this.shoppingListService.deleteIngredient(this.id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
