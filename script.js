// script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded');
  const characterGrid = document.getElementById('character-grid');
  const characterForm = document.getElementById('character-form');
  const editForm = document.getElementById('edit-form');
  const deleteBtn = document.getElementById('delete-btn');

  // Load characters from local storage
  let characters = JSON.parse(localStorage.getItem('characters')) || [];
  console.log('Loaded characters:', characters);

  // If on index.html, render cards
  if (characterGrid) {
    console.log('Rendering characters on index.html');
    renderCharacters();
  }

  // If on create.html, handle form submission
  if (characterForm) {
    console.log('Setting up create form');
    characterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Create form submitted');

      const name = document.getElementById('name').value;
      const hp = document.getElementById('hp').value;
      const attackMin = document.getElementById('attack-min').value;
      const attackMax = document.getElementById('attack-max').value;
      const damageMin = document.getElementById('damage-min').value;
      const damageMax = document.getElementById('damage-max').value;
      const motto = document.getElementById('motto').value;
      const abilities = document.getElementById('abilities').value;
      const imageUrl = document.getElementById('image-url').value || 'https://via.placeholder.com/150';

      const character = {
        name,
        hp,
        attack: `${attackMin}-${attackMax}`,
        damage: `${damageMin}-${damageMax}`,
        motto,
        abilities,
        image: imageUrl,
      };
      characters.push(character);
      localStorage.setItem('characters', JSON.stringify(characters));
      console.log('Character saved:', character);
      window.location.href = './index.html';
    });
  }

  // If on edit.html, pre-fill and handle form submission
  if (editForm) {
    console.log('Setting up edit form');
    const index = new URLSearchParams(window.location.search).get('index');
    console.log('Editing character at index:', index);
    const character = characters[index];

    if (character) {
      document.getElementById('edit-index').value = index;
      document.getElementById('name').value = character.name;
      document.getElementById('hp').value = character.hp;
      document.getElementById('attack-min').value = character.attack.split('-')[0];
      document.getElementById('attack-max').value = character.attack.split('-')[1];
      document.getElementById('damage-min').value = character.damage.split('-')[0];
      document.getElementById('damage-max').value = character.damage.split('-')[1];
      document.getElementById('motto').value = character.motto;
      document.getElementById('abilities').value = character.abilities || '';
      document.getElementById('image-url').value = character.image;
    }

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Edit form submitted');

      const index = document.getElementById('edit-index').value;
      const name = document.getElementById('name').value;
      const hp = document.getElementById('hp').value;
      const attackMin = document.getElementById('attack-min').value;
      const attackMax = document.getElementById('attack-max').value;
      const damageMin = document.getElementById('damage-min').value;
      const damageMax = document.getElementById('damage-max').value;
      const motto = document.getElementById('motto').value;
      const abilities = document.getElementById('abilities').value;
      const imageUrl = document.getElementById('image-url').value || characters[index].image;

      characters[index] = {
        name,
        hp,
        attack: `${attackMin}-${attackMax}`,
        damage: `${damageMin}-${damageMax}`,
        motto,
        abilities,
        image: imageUrl,
      };
      localStorage.setItem('characters', JSON.stringify(characters));
      console.log('Character updated:', characters[index]);
      window.location.href = './index.html';
    });

    // Handle delete button
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        console.log('Delete button clicked');
        if (confirm('Вы уверены, что хотите удалить этого персонажа?')) {
          const index = document.getElementById('edit-index').value;
          characters.splice(index, 1);
          localStorage.setItem('characters', JSON.stringify(characters));
          console.log('Character deleted at index:', index);
          window.location.href = './index.html';
        }
      });
    }
  }

  // Render character cards and "+" card
  function renderCharacters() {
    console.log('Starting renderCharacters');
    characterGrid.innerHTML = '';
    console.log('Rendering', characters.length, 'characters');

    characters.forEach((character, index) => {
      console.log('Rendering character:', character.name);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${character.image}" alt="${character.name}">
            <div class="card-content">
              <h3>${character.name}</h3>
              <p><strong>Здоровье:</strong> ${character.hp}</p>
              <p><strong>Атака:</strong> ${character.attack}</p>
              <p><strong>Урон:</strong> ${character.damage}</p>
              <p><strong>Девиз:</strong> ${character.motto}</p>
            </div>
            <div class="edit-btn" data-index="${index}">⚙️</div>
          </div>
          <div class="card-back">
            <h3>Способности</h3>
            <p>${character.abilities || 'Нет способностей'}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('edit-btn')) {
          card.classList.toggle('flipped');
          console.log('Card flipped:', character.name);
        }
      });

      card.querySelector('.edit-btn').addEventListener('click', () => {
        console.log('Edit button clicked for index', index);
        window.location.href = './edit.html?index=' + index;
      });

      characterGrid.appendChild(card);
    });

    // Add "+" card
    console.log('Adding + card');
    const addCard = document.createElement('div');
    addCard.className = 'card add-card';
    addCard.innerHTML = '<span>+</span>';
    addCard.addEventListener('click', () => {
      console.log('Add card clicked, redirecting to create.html');
      try {
        window.location.href = './create.html';
      } catch (error) {
        console.error('Error redirecting to create.html:', error);
        alert('Ошибка: Не удалось загрузить страницу создания персонажа. Проверьте, что create.html существует.');
      }
    });
    characterGrid.appendChild(addCard);
  }
});
