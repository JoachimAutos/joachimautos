/* ============================================================
   JOACHIM'S AUTOS — app.js
   ============================================================ */

// ── FIREBASE SETUP ────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmou8Pm9Eu9ANpBq19a7v1M5iUtSgRyGc",
  authDomain: "joachimautos-b3996.firebaseapp.com",
  projectId: "joachimautos-b3996",
  storageBucket: "joachimautos-b3996.firebasestorage.app",
  messagingSenderId: "520168981717",
  appId: "1:520168981717:web:55f6b95e1b388c03bf0e5c",
  measurementId: "G-8FCT4HV213"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const listingsCollection = collection(db, "listings");

// ── CAR DATA ──────────────────────────────────────────────
const carsData = [
  {
    id: 1,
    make: "Toyota", model: "Camry", year: 2022,
    price: 24500, mileage: 18000, type: "Sedan", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Toyota,Camry,sedan,car",
    color: "Pearl White", fuel: "Petrol", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "One owner, clean title, full service history. New tires and recent oil change. Great fuel economy and a very comfortable ride for the whole family."
  },
  {
    id: 2,
    make: "BMW", model: "X5", year: 2023,
    price: 68000, mileage: 5000, type: "SUV", condition: "New",
    image: "https://source.unsplash.com/600x400/?BMW,X5,luxury,SUV",
    color: "Jet Black", fuel: "Petrol", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Barely used demo model. Fully loaded with panoramic sunroof, heated seats, 360° camera, and full driver assist package. In showroom condition."
  },
  {
    id: 3,
    make: "Ford", model: "F-150", year: 2021,
    price: 35000, mileage: 32000, type: "Truck", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Ford,F150,pickup,truck",
    color: "Oxford White", fuel: "Petrol", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Powerful V8 engine with tow package, bed liner, and running boards. Perfect for business or weekend off-road adventures."
  },
  {
    id: 4,
    make: "Honda", model: "Civic", year: 2023,
    price: 22000, mileage: 3000, type: "Sedan", condition: "New",
    image: "https://source.unsplash.com/600x400/?Honda,Civic,sedan,car",
    color: "Sonic Grey", fuel: "Petrol", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Brand new with full factory warranty. Sport trim with turbocharged engine, Apple CarPlay, Android Auto, and Honda Sensing safety suite."
  },
  {
    id: 5,
    make: "Mercedes", model: "GLE 450", year: 2022,
    price: 78000, mileage: 11000, type: "SUV", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Mercedes,GLE,luxury,SUV",
    color: "Selenite Grey", fuel: "Hybrid", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Stunning luxury SUV with AMG Sport package. Air suspension, Burmester surround sound, and night vision assist. Low mileage, impeccable condition."
  },
  {
    id: 6,
    make: "Hyundai", model: "Tucson", year: 2022,
    price: 27500, mileage: 21000, type: "SUV", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Hyundai,Tucson,SUV,car",
    color: "Phantom Black", fuel: "Hybrid", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Hybrid model with excellent fuel economy. Panoramic roof, wireless charging, and smart parking assist. The perfect family SUV at a great price."
  },
  {
    id: 7,
    make: "Ford", model: "Mustang GT", year: 2021,
    price: 42000, mileage: 14000, type: "Coupe", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Ford,Mustang,GT,red,sports",
    color: "Race Red", fuel: "Petrol", transmission: "Manual",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "5.0L V8 Coyote engine producing 450hp. Brembo brakes, Recaro seats, and active exhaust. An absolutely thrilling driving experience."
  },
  {
    id: 8,
    make: "Toyota", model: "RAV4", year: 2023,
    price: 31000, mileage: 1500, type: "SUV", condition: "New",
    image: "https://source.unsplash.com/600x400/?Toyota,RAV4,blue,SUV",
    color: "Blueprint Blue", fuel: "Hybrid", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "New arrival. Hybrid powertrain with AWD, 8-inch touchscreen, Toyota Safety Sense 2.0, and wireless Apple CarPlay. Excellent value for money."
  },
  {
    id: 9,
    make: "Honda", model: "CR-V", year: 2020,
    price: 19500, mileage: 45000, type: "SUV", condition: "Used",
    image: "https://source.unsplash.com/600x400/?Honda,CRV,silver,SUV",
    color: "Lunar Silver", fuel: "Petrol", transmission: "Automatic",
    seller: "Joachim's Autos", phone: "+233 257 197 178",
    description: "Well maintained family SUV with two previous owners. Full service history available. Great cargo space and a very reliable engine."
  }
];

// Active dataset (user listings get added here)
let allCars = [...carsData];
// Track current filter tab value
let activeTab = '';

// ── HELPERS ───────────────────────────────────────────────
// Clean phone number to digits only for WhatsApp links
function waPhone(phone) {
  return phone.replace(/\D/g, '');
}

// Build a proper WhatsApp intro message for a car
function waMessage(car) {
  const msg =
    'Hello! I found your ' + car.year + ' ' + car.make + ' ' + car.model + ' listed on Joachim Automotive and I am interested.\n\n' +
    'Car: ' + car.year + ' ' + car.make + ' ' + car.model + '\n' +
    'Price: GH' + String.fromCharCode(8373) + car.price.toLocaleString() + '\n' +
    'Mileage: ' + car.mileage.toLocaleString() + ' km\n' +
    'Fuel: ' + car.fuel + '\n' +
    'Transmission: ' + car.transmission + '\n' +
    'Location: ' + (car.location || 'Ghana') + '\n\n' +
    'Is this car still available? I would like to know more. Thank you!';
  return encodeURIComponent(msg);
}

// ── FREE LISTING TRACKER ──────────────────────────────────
// Uses localStorage so it persists even after browser is closed
const FREE_LISTING_KEY  = 'ja_free_listing_used';
const FREE_PHOTO_LIMIT  = 8;

function hasUsedFreeListing() {
  return localStorage.getItem(FREE_LISTING_KEY) === 'true';
}

function markFreeListingUsed() {
  localStorage.setItem(FREE_LISTING_KEY, 'true');
}

// Show payment required modal
function showPaymentRequired() {
  openModal('paymentModal');
}

// Gate the sell modal — free first time, paid after
function tryOpenSellModal() {
  if (hasUsedFreeListing()) {
    showPaymentRequired();
  } else {
    uploadedPhotos = [];
    openModal('sellModal');
    // Render empty slots after modal opens
    setTimeout(() => renderPhotoSlots(), 50);
  }
}

// ── DYNAMIC SEARCH FILTER ────────────────────────────────
// Rebuilds the Make dropdown from whatever cars are in allCars
function updateMakeFilter() {
  const select = document.getElementById('filterMake');
  if (!select) return;

  // Get unique makes from all cars, sorted A-Z
  const makes = [...new Set(allCars.map(c => c.make))].sort();

  // Keep the current selection
  const current = select.value;

  select.innerHTML = '<option value="">All Makes</option>';
  makes.forEach(make => {
    const opt = document.createElement('option');
    opt.value = make;
    opt.textContent = make;
    if (make === current) opt.selected = true;
    select.appendChild(opt);
  });
}

// ── RENDER CARS ───────────────────────────────────────────
function renderCars(cars) {
  const grid     = document.getElementById('carGrid');
  const noResult = document.getElementById('noResults');
  grid.innerHTML = '';

  if (!cars.length) {
    noResult.style.display = 'block';
    return;
  }
  noResult.style.display = 'none';

  cars.forEach((car, i) => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="car-img-wrap">
        <img
          src="${car.image}"
          alt="${car.year} ${car.make} ${car.model}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=60'; this.onerror=null;"
        />
        <div class="card-badges">
          <span class="badge ${car.condition === 'New' ? 'badge-new' : 'badge-used'}">${car.condition}</span>
          <span class="badge badge-type">${car.type}</span>
        </div>
        <button class="card-wishlist" title="Save for later" onclick="event.stopPropagation(); toggleWishlist(this)">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="car-body">
        <div class="car-title">${car.year} ${car.make} ${car.model}</div>
        <div class="car-specs">
          <span class="spec-pill"><i class="fas fa-tachometer-alt"></i>${car.mileage.toLocaleString()} km</span>
          <span class="spec-pill"><i class="fas fa-gas-pump"></i>${car.fuel}</span>
          <span class="spec-pill"><i class="fas fa-cog"></i>${car.transmission}</span>
          <span class="spec-pill"><i class="fas fa-palette"></i>${car.color}</span>
          ${car.location ? `<span class="spec-pill"><i class="fas fa-map-marker-alt"></i>${car.location}</span>` : ''}
        </div>
        <div class="car-price-row">
          <div class="car-price">
            GH₵${car.price.toLocaleString()}
            <small>Negotiable</small>
          </div>
          <div class="card-actions">
            <button class="btn-details" onclick="viewDetail(${car.id})">
              <i class="fas fa-eye"></i> View
            </button>
            <a class="btn-card-whatsapp" href="https://wa.me/${waPhone(car.phone)}?text=${waMessage(car)}" target="_blank" onclick="event.stopPropagation()" title="Chat on WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('totalCount').textContent = allCars.length;
}

// ── WISHLIST TOGGLE ───────────────────────────────────────
function toggleWishlist(btn) {
  const icon = btn.querySelector('i');
  const liked = icon.classList.contains('fas');

  if (!liked) {
    // LIKE
    icon.classList.replace('far', 'fas');
    btn.classList.add('liked');
    showToast('❤️ Added to your saved cars', 'success');
  } else {
    // UNLIKE — revert immediately
    icon.classList.replace('fas', 'far');
    btn.classList.remove('liked');
    showToast('💔 Removed from saved cars', 'error');
  }
}

// ── HERO SEARCH FILTER ────────────────────────────────────
function filterCars() {
  const make     = document.getElementById('filterMake').value;
  const type     = document.getElementById('filterType').value;
  const maxPrice = document.getElementById('filterPrice').value;

  const filtered = allCars.filter(car => {
    return (!make     || car.make === make)
        && (!type     || car.type === type)
        && (!maxPrice || car.price <= parseInt(maxPrice));
  });

  // Reset tab
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab')?.classList.add('active');
  activeTab = '';

  renderCars(filtered);

  // Scroll to listings
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });

  if (!filtered.length) {
    showToast('No cars match those filters. Try wider criteria.', 'error');
  } else {
    showToast(`Found ${filtered.length} car${filtered.length !== 1 ? 's' : ''} matching your search!`, 'success');
  }
}

// ── TAB FILTER ────────────────────────────────────────────
function filterByTab(btn, value) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeTab = value;

  const filtered = allCars.filter(car => {
    if (!value)          return true;
    if (value === 'New') return car.condition === 'New';
    if (value === 'Used')return car.condition === 'Used';
    return car.type === value;
  });

  renderCars(filtered);
}

// ── VIEW DETAIL ───────────────────────────────────────────
function viewDetail(id) {
  const car = allCars.find(c => c.id === id);
  if (!car) return;

  // Build photos array — use allPhotos if available, else just the single image
  const photos = (car.allPhotos && car.allPhotos.length > 0) ? car.allPhotos : [car.image];
  const hasMany = photos.length > 1;

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-gallery">
      <div class="slider-wrap" id="detailSlider">
        <div class="slider-track" id="sliderTrack">
          ${photos.map((photo, i) => `
            <div class="slide">
              <img src="${photo}" alt="Photo ${i+1}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=680&q=60'; this.onerror=null;" />
            </div>
          `).join('')}
        </div>
        ${hasMany ? `
          <button class="slider-arrow slider-prev" onclick="slideGallery(-1)"><i class="fas fa-chevron-left"></i></button>
          <button class="slider-arrow slider-next" onclick="slideGallery(1)"><i class="fas fa-chevron-right"></i></button>
          <div class="slider-dots" id="sliderDots">
            ${photos.map((_, i) => `<span class="sdot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`).join('')}
          </div>
          <div class="slider-counter" id="sliderCounter">1 / ${photos.length}</div>
        ` : ''}
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-top">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <span class="badge ${car.condition === 'New' ? 'badge-new' : 'badge-used'}">${car.condition}</span>
            <span class="badge badge-type" style="background:var(--light-gray);color:var(--dark-gray);border:none;">${car.type}</span>
          </div>
          <div class="detail-title">${car.year} ${car.make} ${car.model}</div>
        </div>
        <div class="detail-price">GH₵${car.price.toLocaleString()}</div>
      </div>

      <div class="detail-specs-grid">
        <div class="dspec"><div class="dspec-label">Mileage</div><div class="dspec-value">${car.mileage.toLocaleString()} km</div></div>
        <div class="dspec"><div class="dspec-label">Fuel Type</div><div class="dspec-value">${car.fuel}</div></div>
        <div class="dspec"><div class="dspec-label">Transmission</div><div class="dspec-value">${car.transmission}</div></div>
        <div class="dspec"><div class="dspec-label">Color</div><div class="dspec-value">${car.color}</div></div>
        <div class="dspec"><div class="dspec-label">Year</div><div class="dspec-value">${car.year}</div></div>
        <div class="dspec"><div class="dspec-label">Condition</div><div class="dspec-value">${car.condition}</div></div>
        ${car.location ? `<div class="dspec"><div class="dspec-label">Location</div><div class="dspec-value">${car.location}</div></div>` : ''}
      </div>

      <div class="detail-desc">${car.description}</div>

      <div style="background:var(--off-white);border-radius:10px;padding:14px 16px;font-size:.85rem;color:var(--dark-gray);margin-bottom:20px;">
        <strong style="color:var(--navy);">Seller:</strong> ${car.seller} &nbsp;|&nbsp;
        <strong style="color:var(--navy);">Phone:</strong> <a href="https://wa.me/${waPhone(car.phone)}?text=${waMessage(car)}" target="_blank" style="color:var(--red);font-weight:600;">${car.phone} <i class="fab fa-whatsapp" style="color:#25d366;"></i></a>
      </div>

      <div class="detail-cta">
        <button class="btn-call" onclick="window.location.href='tel:${car.phone}'">
          <i class="fas fa-phone-alt"></i> Call Now
        </button>
        <a class="btn-chat" href="https://wa.me/${waPhone(car.phone)}?text=${waMessage(car)}" target="_blank">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
        <button class="btn-back" onclick="closeModal('detailModal')">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
  `;

  openModal('detailModal');
  // Init slider after modal renders
  setTimeout(() => initSlider(), 50);
}

// ── PHOTO UPLOAD HANDLER ──────────────────────────────────
let uploadedPhotos = [];

function renderPhotoSlots() {
  const grid = document.getElementById('photoPreviewGrid');
  grid.innerHTML = '';

  for (let i = 0; i < FREE_PHOTO_LIMIT; i++) {
    const slot = document.createElement('div');
    slot.className = 'photo-slot';
    slot.dataset.index = i;

    if (uploadedPhotos[i]) {
      // Filled slot
      slot.innerHTML = `
        <img src="${uploadedPhotos[i]}" alt="Photo ${i + 1}" />
        <button type="button" class="photo-remove" onclick="removePhoto(${i})">
          <i class="fas fa-times"></i>
        </button>
        ${i === 0 ? '<span class="photo-main-badge">Main</span>' : ''}
      `;
    } else {
      // Empty slot — clickable to add photo
      slot.innerHTML = `
        <div class="photo-slot-empty" onclick="triggerPhotoInput(${i})">
          <i class="fas fa-plus"></i>
        </div>
      `;
    }

    grid.appendChild(slot);
  }
}

function triggerPhotoInput(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      uploadedPhotos[index] = ev.target.result;
      renderPhotoSlots();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function removePhoto(index) {
  uploadedPhotos[index] = null;
  // Clean up nulls but keep array positions
  renderPhotoSlots();
}

function handlePhotoUpload(event) {
  // Keep legacy input support — not used in new slot system
  const files = Array.from(event.target.files).slice(0, FREE_PHOTO_LIMIT);
  uploadedPhotos = [];
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedPhotos[i] = e.target.result;
      renderPhotoSlots();
    };
    reader.readAsDataURL(file);
  });
}

// ── SUBMIT NEW LISTING ────────────────────────────────────
async function submitListing(e) {
  e.preventDefault();

  const name         = document.getElementById('sellerName').value.trim();
  const phone        = document.getElementById('sellerPhone').value.trim();
  const make         = document.getElementById('carMake').value.trim();
  const model        = document.getElementById('carModel').value.trim();
  const year         = parseInt(document.getElementById('carYear').value);
  const price        = parseInt(document.getElementById('carPrice').value);
  const mileage      = parseInt(document.getElementById('carMileage').value);
  const type         = document.getElementById('carType').value;
  const transmission = document.getElementById('carTransmission').value;
  const fuel         = document.getElementById('carFuel').value;
  const condition    = document.getElementById('carCondition').value;
  const color        = document.getElementById('carColor').value.trim() || 'Contact Seller';
  const region       = document.getElementById('carRegion').value;
  const city         = document.getElementById('carCity').value.trim();
  const desc         = document.getElementById('carDesc').value.trim();

  if (!name || !phone || !make || !model || !year || !price || !mileage || !region || !city) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Use uploaded photo if available, otherwise fallback to Unsplash
  const emojiMap = { Sedan:'sedan', SUV:'SUV', Truck:'truck', Coupe:'coupe,sports' };
  const image = uploadedPhotos.length > 0
    ? uploadedPhotos[0]
    : `https://source.unsplash.com/600x400/?${make},${model},${emojiMap[type]||'car'}`;

  // Store all uploaded photos (for detail view gallery) — filter out empty slots
  const allPhotos = uploadedPhotos.filter(p => p);

  allCars.unshift({
    id: Date.now(),
    make, model, year, price, mileage, type,
    condition,
    image,
    allPhotos,
    color,
    fuel,
    transmission,
    location: `${city}, ${region}`,
    seller: name,
    phone,
    description: desc || 'Contact seller for full details.'
  });

  // Re-render respecting current tab
  const activeTabBtn = activeTab
    ? document.querySelector(`.tab[onclick*="${activeTab}"]`)
    : document.querySelector('.tab:first-child');
  if (activeTabBtn) filterByTab(activeTabBtn, activeTab);
  else renderCars(allCars);

  // Update search filter with any new makes
  updateMakeFilter();

  // ── SAVE TO FIREBASE ──────────────────────────────────
  const newCar = {
    id: Date.now(),
    make, model, year, price, mileage, type,
    condition,
    image,
    allPhotos: allPhotos.length > 0 ? allPhotos : [image],
    color,
    fuel,
    transmission,
    location: `${city}, ${region}`,
    seller: name,
    phone,
    description: desc || 'Contact seller for full details.',
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(listingsCollection, newCar);
  } catch (err) {
    console.error('Firebase save error:', err);
  }

  // Mark free listing as used
  markFreeListingUsed();

  // Reset form and photo state
  closeModal('sellModal');
  e.target.reset();
  uploadedPhotos = [];
  renderPhotoSlots();
  document.getElementById('carRegion').value = '';

  showToast(`✅ Your ${year} ${make} ${model} has been listed!`, 'success');
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
}

// ── GALLERY SLIDER ────────────────────────────────────────
let currentSlide = 0;
let totalSlides  = 0;
let touchStartX  = 0;
let touchEndX    = 0;

function initSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  totalSlides  = track.querySelectorAll('.slide').length;
  currentSlide = 0;
  if (totalSlides <= 1) return; // no slider needed for single photo

  // Touch swipe support
  const wrap = document.getElementById('detailSlider');
  if (wrap) {
    wrap.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) slideGallery(diff > 0 ? 1 : -1);
    });
  }
}

function slideGallery(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function updateSlider() {
  const track   = document.getElementById('sliderTrack');
  const dots    = document.querySelectorAll('.sdot');
  const counter = document.getElementById('sliderCounter');
  if (track)   track.style.transform = `translateX(-${currentSlide * 100}%)`;
  if (counter) counter.textContent   = `${currentSlide + 1} / ${totalSlides}`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

// ── GALLERY SWITCHER (legacy fallback) ────────────────────
function switchPhoto(src, thumb) {
  document.getElementById('mainDetailImg').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', function(e) {
    if (e.target === this) { closeModal(this.id); }
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
  }
});

// ── MOBILE MENU ───────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── NAVBAR SCROLL EFFECT ──────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar?.classList.toggle('scrolled', window.scrollY > 50);

  // Back to top button
  const btn = document.getElementById('backToTop');
  btn?.classList.toggle('visible', window.scrollY > 400);
});

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load user-submitted listings from Firebase first
  try {
    const q = query(listingsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const firebaseListings = [];
    snapshot.forEach(doc => {
      firebaseListings.push({ ...doc.data(), firestoreId: doc.id });
    });
    // Merge Firebase listings on top of default cars
    allCars = [...firebaseListings, ...carsData];
  } catch (err) {
    console.error('Firebase load error:', err);
    allCars = [...carsData];
  }

  renderCars(allCars);
  updateMakeFilter();
  document.getElementById('totalCount').textContent = allCars.length;
});

// ── EXPOSE FUNCTIONS TO GLOBAL SCOPE ─────────────────────
// Required because type="module" makes all functions local
window.tryOpenSellModal  = tryOpenSellModal;
window.openModal         = openModal;
window.closeModal        = closeModal;
window.filterCars        = filterCars;
window.filterByTab       = filterByTab;
window.viewDetail        = viewDetail;
window.submitListing     = submitListing;
window.toggleWishlist    = toggleWishlist;
window.toggleMenu        = toggleMenu;
window.slideGallery      = slideGallery;
window.goToSlide         = goToSlide;
window.switchPhoto       = switchPhoto;
window.triggerPhotoInput = triggerPhotoInput;
window.removePhoto       = removePhoto;
window.handlePhotoUpload = handlePhotoUpload;
