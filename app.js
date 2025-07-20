// RideBuddy Application JavaScript (MODERNIZED FOR BOOK/OFFER FLOW)

class RideBuddyApp {
    constructor() {
        // State Vars
        this.currentUser = null;
        this.selectedServiceType = null;
        this.selectedProvider = null;
        this.selectedOfferType = null;
        this.currentPage = 'welcome-page';
        this.mockProviders = [
            // Demo providers -- normally fetched from backend
            {
                id: 'prov001',
                name: 'Jane Doe',
                type: 'driver',
                withVehicle: true,
                rate: 480,
                rating: 4.8,
                experience: "10+ years driving tourists, speaks Hindi/English",
                summary: "Wheelchair accessible car, always punctual.",
                profilePhoto: '',
            }, {
                id: 'prov002',
                name: 'Ravi Kumar',
                type: 'buddy',
                withVehicle: false,
                rate: 400,
                rating: 4.0,
                experience: "Friendly, patient companion for walks and visits.",
                summary: "Specializes in helping seniors.",
                profilePhoto: '',
            }, {
                id: 'prov003',
                name: 'Lakshmi S.',
                type: 'scout',
                withVehicle: false,
                rate: 350,
                rating: 3.5,
                experience: "Great at navigating public places.",
                summary: "Fluent in 3 languages, calm demeanor.",
                profilePhoto: '',
            }, {
                id: 'prov004',
                name: 'Omkar Jadhav',
                type: 'driver',
                withVehicle: false,
                rate: 300,
                rating: 4.4,
                experience: "Will accompany you with your own vehicle.",
                summary: "Helps with hospital trips.",
                profilePhoto: '',
            }
        ];
        this.init();
    }

    /* ------------------ INIT ---------------------- */
    init() {
        this.bindEvents();
        this.showPage('welcome-page');
    }

    /* ------------ EVENT BINDING FOR FLOW -------------- */
    bindEvents() {
        // Welcome Book/Offer
        this.qs('#choose-book-btn')?.addEventListener('click', () => this.showPage('book-services-page'));
        this.qs('#choose-offer-btn')?.addEventListener('click', () => this.showPage('offer-services-page'));

        // BOOK SERVICES flow
        this.qsa('.service-choice-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const type = e.target.dataset.type;
                this.selectedServiceType = type;
                this.showProviderList(type);
            });
        });
        this.qs('#back-to-welcome-book')?.addEventListener('click', () => this.showPage('welcome-page'));
        this.qs('#back-to-book-types')?.addEventListener('click', () => this.showPage('book-services-page'));
        this.qs('#back-to-provider-list')?.addEventListener('click', () => this.showProviderList(this.selectedServiceType));

        // OFFER SERVICES flow
        this.qsa('.offer-choice-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const subrole = e.target.dataset.offerType;
                this.selectedOfferType = subrole;
                this.showProviderRegistration(subrole);
            });
        });
        this.qs('#back-to-welcome-offer')?.addEventListener('click', () => this.showPage('welcome-page'));
        this.qs('#back-to-offer-types')?.addEventListener('click', () => this.showPage('offer-services-page'));

        // Provider booking & registration
        this.qs('#booking-form')?.addEventListener('submit', e => this.handleBookingForm(e));
        this.qs('#provider-registration-form')?.addEventListener('submit', e => this.handleProviderRegistration(e));

        // Rate cap demo: update on input (registration)
        const providerRate = this.qs('#provider-rate');
        if (providerRate) {
            providerRate.addEventListener('input', e => this.updateRateCap());
        }

        // Panic
        this.qs('#panic-btn')?.addEventListener('click', () => this.handlePanicButton());

        // Chat etc. (retain all original event binds as needed below!)
    }

    /* ----------- HELPER QUERY FUNCTIONS ---------- */
    qs(selector)        { return document.querySelector(selector);}
    qsa(selector)       { return document.querySelectorAll(selector);}
    showPage(id) {
        this.qsa('.page').forEach(pg => { pg.style.display = 'none'; pg.classList.remove('active'); });
        const pg = this.qs('#' + id);
        if (pg) { pg.style.display = 'block'; pg.classList.add('active'); this.currentPage = id;}
    }

    /* --------- BOOK SERVICES: LIST PROVIDERS FLOW --------- */
    showProviderList(serviceType) {
        this.showPage('provider-list-page');
        // Filter providers by type
        const filtered = this.mockProviders.filter(p => p.type === serviceType);
        const parent = this.qs('#provider-profiles-list');
        if (parent) {
            parent.innerHTML = '';
            filtered.forEach(prov => {
                const card = document.createElement('div');
                card.className = "provider-profile-card";
                card.innerHTML = `
                    <h3>${prov.name}</h3>
                    <p><strong>Service:</strong> ${this.serviceLabel(prov)}</p>
                    <p><strong>Rate:</strong> ₹${prov.rate}/hour</p>
                    <p><strong>Rating:</strong> ${prov.rating} ⭐</p>
                    <p>${prov.experience}</p>
                    <button class="btn btn--primary" data-provider-id="${prov.id}">Book</button>
                `;
                card.querySelector('button').addEventListener('click', () => {
                    this.selectedProvider = prov;
                    this.showBookForm(prov);
                });
                parent.appendChild(card);
            });
        }
    }

    serviceLabel(prov) {
        return prov.type === "driver"
            ? ("Driver" + (prov.withVehicle ? " (With Vehicle)" : " (No Vehicle)"))
            : (prov.type === "buddy" ? "Buddy" : "Scout");
    }

    /* ----------- BOOK SERVICE FORM ----------- */
    showBookForm(provider) {
        this.showPage('book-form-page');
        // Fill info
        const rateInfo = this.qs('#booking-rate-info');
        if (rateInfo) rateInfo.textContent = `You are booking ${provider.name} at ₹${provider.rate}/hour.`;
        this.qs('#booking-date').value = '';
        this.qs('#booking-hours').value = '';
        this.qs('#booking-location').value = '';
        this.qs('#total-amount').textContent = '';
        this.qs('#advance-amount').textContent = '';

        // Update summary dynamically
        ['#booking-hours'].forEach(sel => {
            const el = this.qs(sel);
            if (el) el.addEventListener('input', () => this.updateBookingSummary());
        });
    }

    updateBookingSummary() {
        const hours = Number(this.qs('#booking-hours').value);
        if (this.selectedProvider && hours > 0) {
            const total = this.selectedProvider.rate * hours;
            const advance = Math.round(total * 0.10);
            this.qs('#total-amount').textContent = '₹' + total;
            this.qs('#advance-amount').textContent = '₹' + advance;
        }
    }

    /* ---------- BOOKING FORM VALIDATION & ADVANCE ---------- */
    handleBookingForm(e) {
        e.preventDefault();
        const date = this.qs('#booking-date').value;
        const hours = Number(this.qs('#booking-hours').value);
        const loc = this.qs('#booking-location').value.trim();

        // Validation
        if (!date || !this.validateBookingDate(date)) {
            alert('Please pick a date at least 3 days from today.');
            return;
        }
        if (!hours || hours < 1) {
            alert('Hours must be 1 or more.');
            return;
        }
        if (!loc) {
            alert('Please enter meeting location.');
            return;
        }
        if (!this.selectedProvider) {
            alert('No provider selected!');
            return;
        }

        const total = this.selectedProvider.rate * hours;
        const advance = Math.round(total * 0.10);
        // Simulate payment (replace with gateway integration)
        alert(`You need to pay ₹${advance} in advance to confirm your booking of ${this.selectedProvider.name}.`);
        // After "payment", reset and go back to welcome or dashboard:
        this.showPage('welcome-page'); // Or show dashboard, booking status, etc.
        this.selectedProvider = null;
    }

    validateBookingDate(dateString) {
        // Must be >= 3 days from today
        const d = new Date(dateString), now = new Date();
        now.setHours(0,0,0,0);
        const min = new Date(now); min.setDate(min.getDate() + 3);
        return d >= min;
    }

    /* -------- OFFER SERVICES: PROVIDER REGISTRATION FLOW ------ */
    showProviderRegistration(subrole) {
        this.showPage('provider-registration-page');
        this.qs('#provider-reg-title').textContent = subrole === "driver-buddy"
            ? "Register as Driver Buddy"
            : "Register as Scout";
        // Toggle driver fields
        this.qsa('.driver-buddy-fields').forEach(f => f.style.display = subrole === "driver-buddy" ? "" : "none");
        // Show/hide scout fields, etc.
        this.qsa('.scout-fields').forEach(f => f.style.display = subrole === "scout" ? "" : "none");
        this.updateRateCap();
    }

    /* --------- DYNAMIC RATE CAP LOGIC --------- */
    getMaxRateByRating(rating=5.0) {
        // Every 0.1 below 5.0 → ₹10 decrease, floor at 0
        const base = 500;
        const step = 10;
        const reduction = Math.round((5.0 - rating) / 0.1) * step;
        return Math.max(0, base - reduction);
    }

    updateRateCap() {
        // Demo: assume new providers have 5.0 rating (first registration)
        let rating = 5.0;
        const cap = this.getMaxRateByRating(rating);
        const info = this.qs('#rate-cap-info');
        if (info) info.textContent = `Your current rating: ${rating} — Max rate allowed: ₹${cap}/hr`;
        const input = this.qs('#provider-rate');
        if (input) input.max = cap;
    }

    handleProviderRegistration(e) {
        e.preventDefault();
        const name = this.qs('#provider-name').value.trim();
        const email = this.qs('#provider-email').value.trim();
        const phone = this.qs('#provider-phone').value.trim();
        const experience = this.qs('#provider-experience').value.trim();
        const rate = Number(this.qs('#provider-rate').value);
        let rating = 5.0; // New providers start at top

        // Validate
        if (!name || !email || !phone || !experience || !rate) {
            alert("Please fill in all required fields.");
            return;
        }
        // Enforce cap
        const maxRate = this.getMaxRateByRating(rating);
        if (rate > maxRate) {
            alert(`Based on your rating, you can only charge up to ₹${maxRate}/hour.`);
            return;
        }

        // Drivers: require license upload
        if (this.selectedOfferType === "driver-buddy") {
            const license = this.qs('#provider-license').files[0];
            if (!license) {
                alert("Driver license upload required.");
                return;
            }
            // ...handle vehicle details/storage as needed...
        }

        alert("Registration complete! You can now offer your services.");
        this.showPage('welcome-page');
    }

    /* ------------------ GLOBAL: PANIC BUTTON ------------------ */
    handlePanicButton() {
        alert("🚨 EMERGENCY ALERT: Help is on the way. (This would notify support and your emergency contacts in real app.)");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.rideBuddyApp = new RideBuddyApp();
});

