import {options} from "./constants";

class Api {
  constructor(options) {
    this._adress = options.baseUrl;
    this._headers = options.headers;
  }

  getInitialCards() {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/cards`,
      {headers: {
          authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }});
  }

  getUserInfo() {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/users/me`,
      {headers: {
          authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }});
  }

  setUserInfo(userName, userJob) {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userName,
        about: userJob
      })
    });
  }

  setNewCard(cardName, cardLink) {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: cardName,
        link: cardLink
      })
    });
  }

  deleteCard(cardId) {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

  }

  changeLikeCardStatus(cardId, isLiked) {
    const jwt = localStorage.getItem('jwt');
    if (!isLiked) {
      return this._request(`${this._adress}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      return this._request(`${this._adress}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  setUserAvatar(avatarLink) {
    const jwt = localStorage.getItem('jwt');
    return this._request(`${this._adress}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatarLink
      })
    });
  }

  _checkServerAnswer(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkServerAnswer);
  }

}

const api = new Api(options);

export default api;
