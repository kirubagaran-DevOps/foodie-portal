import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  dish: string;
  price: number;
  time: string;
  rating: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly restaurants: Restaurant[] = [
    { id: 1, name: 'The Pizza Project', cuisine: 'Italian', dish: 'Truffle mushroom pizza', price: 349, time: '25–30 min', rating: '4.7', emoji: '🍕', color: '#eaa86e' },
    { id: 2, name: 'Bowl & Bloom', cuisine: 'Healthy', dish: 'Avocado harvest bowl', price: 289, time: '20–25 min', rating: '4.6', emoji: '🥗', color: '#9ecb96' },
    { id: 3, name: 'Nei soru', cuisine: 'Indian', dish: 'Hyderabadi chicken biryani', price: 329, time: '30–35 min', rating: '4.8', emoji: '🍛', color: '#e5bd61' },
    { id: 4, name: 'Bao House', cuisine: 'Asian', dish: 'Crispy tofu bao', price: 259, time: '25–30 min', rating: '4.5', emoji: '🥟', color: '#e7a3a3' },
    { id: 5, name: 'Dosa District', cuisine: 'Indian', dish: 'Masala dosa', price: 179, time: '15–20 min', rating: '4.7', emoji: '🥞', color: '#d9b778' },
    { id: 6, name: 'Pasta Parade', cuisine: 'Italian', dish: 'Creamy pesto penne', price: 319, time: '25–30 min', rating: '4.4', emoji: '🍝', color: '#c9a08c' },
  ];

  readonly cuisines = ['All', ...new Set(this.restaurants.map((restaurant) => restaurant.cuisine))];
  selectedCuisine = 'All';
  search = '';
  cart: Record<number, number> = {};

  get filteredRestaurants(): Restaurant[] {
    const query = this.search.toLowerCase().trim();
    return this.restaurants.filter((restaurant) =>
      (this.selectedCuisine === 'All' || restaurant.cuisine === this.selectedCuisine) &&
      `${restaurant.name} ${restaurant.cuisine} ${restaurant.dish}`.toLowerCase().includes(query),
    );
  }

  get cartEntries(): Array<{ restaurant: Restaurant; quantity: number }> {
    return this.restaurants
      .filter((restaurant) => (this.cart[restaurant.id] ?? 0) > 0)
      .map((restaurant) => ({ restaurant, quantity: this.cart[restaurant.id] }));
  }

  get itemCount(): number { return this.cartEntries.reduce((count, item) => count + item.quantity, 0); }
  get subtotal(): number { return this.cartEntries.reduce((total, item) => total + item.restaurant.price * item.quantity, 0); }
  get deliveryFee(): number { return this.itemCount ? 39 : 0; }
  get total(): number { return this.subtotal + this.deliveryFee; }

  addToCart(id: number): void { this.cart[id] = (this.cart[id] ?? 0) + 1; }
  changeQuantity(id: number, delta: number): void { this.cart[id] = Math.max(0, (this.cart[id] ?? 0) + delta); }
  formatPrice(amount: number): string { return `₹${amount.toLocaleString('en-IN')}`; }
}
