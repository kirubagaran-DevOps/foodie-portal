const restaurants = [
  { id: 1, name: 'The Pizza Project', cuisine: 'Italian', dish: 'Truffle mushroom pizza', price: 349, time: '25–30 min', rating: '4.7', emoji: '🍕', color: '#eaa86e' },
  { id: 2, name: 'Bowl & Bloom', cuisine: 'Healthy', dish: 'Avocado harvest bowl', price: 289, time: '20–25 min', rating: '4.6', emoji: '🥗', color: '#9ecb96' },
  { id: 3, name: 'Namma Biryani', cuisine: 'Indian', dish: 'Hyderabadi chicken biryani', price: 329, time: '30–35 min', rating: '4.8', emoji: '🍛', color: '#e5bd61' },
  { id: 4, name: 'Bao House', cuisine: 'Asian', dish: 'Crispy tofu bao', price: 259, time: '25–30 min', rating: '4.5', emoji: '🥟', color: '#e7a3a3' },
  { id: 5, name: 'Dosa District', cuisine: 'Indian', dish: 'Masala dosa', price: 179, time: '15–20 min', rating: '4.7', emoji: '🥞', color: '#d9b778' },
  { id: 6, name: 'Pasta Parade', cuisine: 'Italian', dish: 'Creamy pesto penne', price: 319, time: '25–30 min', rating: '4.4', emoji: '🍝', color: '#c9a08c' }
];

const state = { filter: 'All', search: '', cart: {} };
const grid = document.querySelector('#restaurantGrid');
const filters = document.querySelector('#filters');
const cartItems = document.querySelector('#cartItems');
const cartSummary = document.querySelector('#cartSummary');
const headerCartCount = document.querySelector('#headerCartCount');
const cartBadge = document.querySelector('#cartBadge');

function formatPrice(amount) { return `₹${amount.toLocaleString('en-IN')}`; }

function renderFilters() {
  const cuisines = ['All', ...new Set(restaurants.map((restaurant) => restaurant.cuisine))];
  filters.innerHTML = cuisines.map((cuisine) => `<button class="filter-button ${state.filter === cuisine ? 'active' : ''}" type="button" data-filter="${cuisine}">${cuisine}</button>`).join('');
}

function renderRestaurants() {
  const query = state.search.toLowerCase().trim();
  const matches = restaurants.filter((restaurant) => (state.filter === 'All' || restaurant.cuisine === state.filter) && `${restaurant.name} ${restaurant.cuisine} ${restaurant.dish}`.toLowerCase().includes(query));
  grid.innerHTML = matches.length ? matches.map((restaurant) => `
    <article class="restaurant-card">
      <div class="restaurant-image" style="background:${restaurant.color}"><span>${restaurant.emoji}</span></div>
      <div class="card-content"><div class="restaurant-name">${restaurant.name}</div><div class="restaurant-meta">${restaurant.cuisine} · ${restaurant.time}</div>
        <div class="card-bottom"><span class="rating">★ ${restaurant.rating}</span><button class="add-button" type="button" data-add="${restaurant.id}">ADD · ${formatPrice(restaurant.price)}</button></div>
      </div>
    </article>`).join('') : '<div class="no-results">No restaurants match that search. Try another dish or filter.</div>';
}

function renderCart() {
  const entries = Object.entries(state.cart).filter(([, quantity]) => quantity > 0);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + restaurants.find((restaurant) => restaurant.id === Number(id)).price * quantity, 0);
  const delivery = itemCount ? 39 : 0;
  headerCartCount.textContent = itemCount;
  cartBadge.textContent = itemCount;
  cartItems.innerHTML = entries.length ? entries.map(([id, quantity]) => {
    const item = restaurants.find((restaurant) => restaurant.id === Number(id));
    return `<div class="cart-item"><div><div class="cart-item-name">${item.dish}</div><div class="cart-item-price">${formatPrice(item.price)} · ${item.name}</div></div><div class="quantity"><button type="button" data-change="${id}" data-delta="-1" aria-label="Remove one ${item.dish}">−</button><span>${quantity}</span><button type="button" data-change="${id}" data-delta="1" aria-label="Add one ${item.dish}">+</button></div></div>`;
  }).join('') : '<div class="empty-cart"><span>🛍️</span>Your cart is waiting for something tasty.</div>';
  cartSummary.hidden = !entries.length;
  document.querySelector('#subtotal').textContent = formatPrice(subtotal);
  document.querySelector('#deliveryFee').textContent = formatPrice(delivery);
  document.querySelector('#total').textContent = formatPrice(subtotal + delivery);
}

filters.addEventListener('click', (event) => { if (event.target.matches('[data-filter]')) { state.filter = event.target.dataset.filter; renderFilters(); renderRestaurants(); } });
grid.addEventListener('click', (event) => { if (event.target.matches('[data-add]')) { const id = event.target.dataset.add; state.cart[id] = (state.cart[id] || 0) + 1; renderCart(); } });
cartItems.addEventListener('click', (event) => { if (event.target.matches('[data-change]')) { const id = event.target.dataset.change; state.cart[id] = Math.max(0, (state.cart[id] || 0) + Number(event.target.dataset.delta)); renderCart(); } });
document.querySelector('#searchInput').addEventListener('input', (event) => { state.search = event.target.value; renderRestaurants(); });

renderFilters();
renderRestaurants();
renderCart();
