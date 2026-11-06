// Photos live in assets/. Add a row here to extend the gallery.
const cars = [
  ['Grand Vitara','Maruti Suzuki','SUV','grand-vitara'],
  ['Tucson','Hyundai','SUV','tucson'],
  ['Baleno','Maruti Suzuki','Hatchback','baleno'],
  ['Ciaz','Maruti Suzuki','Sedan','ciaz'],
  ['Fronx','Maruti Suzuki','Crossover','fronx'],
  ['Touareg','Volkswagen','SUV','touareg'],
  ['RAV4','Toyota','SUV','toyota-white']
];
const featured = [
  ['toyota-red','Toyota SUV','Red Toyota SUV outside a modern building'],
  ['tucson-road','Hyundai Tucson','Dark Hyundai Tucson driving on an open road'],
  ['touareg','Volkswagen Touareg','White Volkswagen Touareg in a studio']
];
const select = selector => document.querySelector(selector);
const dots = [...document.querySelectorAll('.dots button')];
dots.forEach((dot,index) => dot.addEventListener('click', () => {
  const [photo,label,alt] = featured[index];
  select('#hero-photo').src = 'assets/' + photo + '.jpg';
  select('#hero-photo').alt = alt;
  select('#hero-caption').textContent = label.toUpperCase();
  dots.forEach((button,i) => button.setAttribute('aria-pressed', String(index === i)));
}));
const brand = select('#brand');
const type = select('#type');
for (const [field,index] of [[brand,1],[type,2]]) {
  for (const name of [...new Set(cars.map(car => car[index]))].sort()) {
    field.add(new Option(name,name));
  }
}
const dialog = select('dialog');
function showModel([model,make,body,photo]) {
  select('#model-photo').src = 'assets/' + photo + '.jpg';
  select('#model-photo').alt = make + ' ' + model;
  select('#model-title').textContent = model;
  select('#model-brand').textContent = make + ' / ' + body;
  select('#model-info').textContent = 'Interested in the ' + model + '? Call the LB Nagar team to check current models, pricing and visit options.';
  dialog.showModal();
}
function renderCars() {
  const grid = select('#grid');
  grid.replaceChildren();
  const matches = cars.filter(car =>
    (!brand.selectedIndex || car[1] === brand.value) &&
    (!type.selectedIndex || car[2] === type.value));
  select('#count').textContent = matches.length ? matches.length + (matches.length === 1 ? ' model' : ' models') : 'No models match. Try another brand or body style.';
  select('#reset').hidden = !brand.selectedIndex && !type.selectedIndex;
  for (const car of matches) {
    const [model,make,body,photo] = car;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.innerHTML = '<img loading="lazy" alt=""><span class="card-body"><small></small><strong></strong><span class="card-link">View details <b>↗</b></span></span>';
    card.querySelector('img').src = 'assets/' + photo + '.jpg';
    card.querySelector('small').textContent = make + ' / ' + body;
    card.querySelector('strong').textContent = model;
    card.addEventListener('click', () => showModel(car));
    grid.append(card);
  }
}
select('#finder').addEventListener('submit', event => {
  event.preventDefault();
  renderCars();
  select('#cars').scrollIntoView();
});
select('#reset').addEventListener('click', () => {
  select('#finder').reset();
  renderCars();
});
select('#close').addEventListener('click', () => dialog.close());
renderCars();
