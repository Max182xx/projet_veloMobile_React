export default class RemoteData {
  static url = "http://localhost:3001/";
  /**
   * L'effet global de cette méthode est d'envoyer une requête à un serveur distant,
   * de vérifier si la requête a réussi, d'analyser la réponse au format JSON,
   * de l'afficher dans la console  et de la renvoyer. Si une étape échoue,
   * il affiche un message d'erreur.
   *
   * @returns Promise<{}[]>
   */

/* Charge la liste des véloMobiles  */
  static loadVelosMobiles() {
    return fetch(RemoteData.url + "velosMobiles")
      .then((response) => {
        console.log(`response.status`, response.status);
        if (response.status == 200) {
          return response.json();
        } else
          throw new Error(
            "Problème de serveur dans loadVelosMobiles. Statut de l'erreur : " +
            response.status
          );
      })
      .then((velosMobiles) => {
        console.log(`velosMobiles`, velosMobiles);
        return velosMobiles;
      });
  }
  /**
   * Supprime un vélo mobile en base de donnée via une requette http utilisant le verbe DELETE
   * @param {*} id
   * @returns Promise<delete Objet veloMobile>
   */
  static deleteVeloMobile(id) {
    return fetch(`${RemoteData.url}velosMobiles/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((response) => {
        console.log(`response.status`, response.status);
        if (response.status == 200) {
          return response.json();
        } else
          throw new Error(
            "Problème de serveur dans deleteVeloMobile. Statut de l'erreur : " +
            response.status
          );
      })
      .then((veloMobile) => {
        console.log(`veloMobile supprimé : `, veloMobile);
        return veloMobile;
      });
  }
  /**
   * Execute une requête HTTP avec le verbe GET
   * afin récupérer la liste des utilisateur
   * @returns Promise <Users []>
   */
  static loadUsers() {
    return fetch(RemoteData.url + "users")
      .then((response) => {
        console.log(`response.status`, response.status);
        if (response.status === 200) {
          return response.json();
        } else
          throw new Error(
            "Problème de serveur dans loadUsers. Statut de l'erreur : " +
            response.status
          );
      })
      .then((users) => {
        console.log(`users`, users);
        return users;
      });
  }

  /**
   * Permet de savoir si l'utilisateur est connecté (login et pwd ok)
   * @param {string} login
   * @param {string} pwd
   * @returns Promise <boolean>
   */
  static isLogged(login, pwd) {
    console.log(`DAns isLogged`, login, pwd);
    return RemoteData.loadUsers().then((users) => {
      let isLogged = false;
      for (let i = 0; i < users.length; i++) {
        if (login === users[i].login && pwd === users[i].pwd) {
          return true;
        }
      }
      return false;
    });
  }
  /**
   * Execute une requête HTTP avec le verbe POST à L'API 
   * pour créer un VéloMobile dans le fichier JSON
   * @param {*} newVeloMobile
   * @returns
   */
  static postVeloMobile(newVeloMobile) {
    return fetch(`${RemoteData.url}velosMobiles/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    /* Convertit l'objet en un chaine JSON */
      body: JSON.stringify(newVeloMobile),
    })
      .then((response) => {
        console.log(`reponse.status de postVelomobile`, response.status);
        if (response.status !== 201)
          throw new Error("Erreur" + response.status);
        return response.json();
      })
      .then((data) => {
        console.log(`data reçue après le post: `, data);
        return data;
      });
  }

  /* Execute une requête HTTP avec le verbe PuT à L'API 
    pour modifier un VéloMobile dans le fichier JSON */
  static putVeloMobile(updatedVeloMobile) {
    return fetch(`${RemoteData.url}velosMobiles/${updatedVeloMobile.id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(updatedVeloMobile)
    })
      .then((response) => {
        console.log(`reponse.status de put Velomobile`, response.status);
        if (response.status !== 200)
          throw new Error("Erreur" + response.status);
        return response.json();
      })
      .then((data) => {
        console.log(`data reçue après le put: `, data);
        return data;
      });
  }

  /* Execute une requête HTTP avec le verbe POST à L'API 
   * pour créer un nouvel abonné dans le fichier JSON */
  static postSubscriber(newSubscriber) {
    return fetch(`${RemoteData.url}subscribers/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newSubscriber),
    })
        .then((response) => {
          console.log(`reponse.status de postSubscriber`, response.status);
          if (response.status !== 201)
            throw new Error("Erreur" + response.status);
          return response.json();
        })
        .then((data) => {
          console.log(`data reçue après le post: `, data);
          return data;
        });
  }
}
