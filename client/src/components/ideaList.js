import IdeasAPI from '../services/ideasAPI';

class IdeaList {
  constructor() {
    this._ideaList = document.getElementById('idea-list');

    this._ideas = this.getIdeas();
  }

  // ----------------------
  getIdeas = async () => {
    try {
      const res = await IdeasAPI.getIdeas();
      this._ideas = res.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  };

  // Editing an idea --------------
  async updateIdeaText(e) {
    if (e.target.classList.contains('idea-text')) {
      e.stopImmediatePropagation();

      const currentCard = e.target.closest('.card');
      this.tag = currentCard.querySelector('.tag').textContent.toLowerCase();

      this.currentUser = localStorage.getItem('username');
      const author = currentCard.querySelector('.author').textContent;

      if (author === this.currentUser) {
        this.text = currentCard.querySelector('.idea-text');
        this.textarea = currentCard.querySelector('.update-text');

        this.updateForm = currentCard.querySelector('.update-form');

        // Hide the text h3 and show the textarea
        this._revealTextarea();

        // Submitting the textarea on Enter key press
        this.textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.updateForm.querySelector('button[type="submit"]').click();
          }
          // Textarea Height
          this.textarea.style.height = `${this.textarea.scrollHeight}px`;
        });
        // Textarea Submit
        this.updateForm.addEventListener(
          'submit',
          this._handleTextUpdate.bind(this)
        );
      }
    }
  }

  async _handleTextUpdate(e) {
    e.preventDefault();

    // get idea ID
    const ideaID = e.target.closest('.card').dataset.id;

    // Update idea into the db
    try {
      await IdeasAPI.updateIdea(ideaID, {
        text: this.textarea.value,
        username: this.currentUser,
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }

    // Display updated text
    new IdeaList();
  }

  _revealTextarea() {
    this.text.style.display = 'none';
    this.textarea.style.display = 'block';

    this.textarea.classList.add(`${this.tag}-color`);
    this.textarea.focus();
    this.textarea.value = this.text.textContent;
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  // Delete an idea clicking on the X mark-----------
  async deleteIdea(e) {
    if (e.target.classList.contains('fa-times')) {
      e.stopImmediatePropagation();

      if (confirm('Are You Sure?')) {
        // get idea ID
        const ideaID = e.target.closest('.card').dataset.id;
        const currentUser = localStorage.getItem('username');

        // remove idea from db
        try {
          await IdeasAPI.deleteIdea(ideaID, currentUser);
        } catch (error) {
          console.log(error);
          alert(error);
        }

        // remove idea from DOM
        new IdeaList();
      }
    }
  }
  // -----------------------
  render() {
    this._ideaList.innerHTML = '';
    for (const idea of this._ideas) {
      const tagClass = this._getTagClass(idea.tag);
      const ideaCard = document.createElement('div');
      ideaCard.dataset.id = idea._id;
      ideaCard.classList.add('card');

      // Format Date
      const day = idea.date.slice(0, 9);
      const time = idea.date.slice(11, 19);

      // Show delete icon only for the idea owner
      let deleteBtn = '';
      if (idea.username === localStorage.getItem('username')) {
        deleteBtn = `<button class="delete"><i class="fas fa-times"></i></button>`;
      }

      ideaCard.innerHTML = `${deleteBtn}
        <div id="update-textarea">
          <form class="update-form" >
            <label for="update-text"></label>
              <textarea id="update-text" class="update-text" name="update-text"
              spellcheck="false" autocomplete="false" rows="1"  ></textarea>
              <button type="submit" style="display: none"></button>
          </form>
          <h3 class="idea-text">${idea.text}</h3>
        </div>
          <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
          <p>
            Posted on <span class="date">${day}</span> by
            <span class="author">${
              idea.username
            }</span> at <span class="date">${time}</span>
          </p>
        `;

      this._ideaList.appendChild(ideaCard);
    }

    // Event Listeners---------------
    this._addEventListeners();
  }

  _getTagClass(tag) {
    const tagSet = new Set();
    tagSet.add('technology');
    tagSet.add('software');
    tagSet.add('business');
    tagSet.add('education');
    tagSet.add('health');
    tagSet.add('inventions');

    return tagSet.has(tag.toLowerCase()) ? `tag-${tag.toLowerCase()}` : '';
  }

  _addEventListeners() {
    this._ideaList.addEventListener('click', this.deleteIdea.bind(this));
    this._ideaList.addEventListener('click', this.updateIdeaText.bind(this));
  }
}

export default IdeaList;
