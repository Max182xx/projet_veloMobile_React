/* Import  des composants, des hooks (useEffect et useState) pour gérer l'état et les effets de bord,
   Interagir avec les données distantes (API) RemoteData
   React router dom etc...
  */
import { useEffect, useState } from "react";
import VeloMobile from "../components/VeloMobile";
import RemoteData from "../services/RemoteData";
import { useOutletContext } from "react-router-dom";
import Modal from "../components/Modal";
import ValidateData from "../services/ValidateData";

/*Déclaration du composant */ 
const ProductsPage = () => {
/* Initialisation des states */ 
  const [velosMobiles, setVelosMobiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creationSuccess, setCreationSuccess] = useState("");
/* State pour les champs vide et suivre l'état de validité */
  const [emptyFields, setEmptyFields] = useState({
    model: false,
    description: false,
    weight: false,
    photo: false,
  });

/* Mise à jour de l'élément veloMobiles via l'id quand il est modifié dans FormPutVeloMobile et 
  envoyé dans RemoteData */
  const handleUpdateVeloMobile = (updatedVeloMobile) => {
    setVelosMobiles(
        velosMobiles.map((vm) =>
            vm.id === updatedVeloMobile.id ? updatedVeloMobile : vm
        )
    );
  };
  /* Retour visuel sur les champs du formulaire qui contiennent des erreurs  */
  const getInputClass = (fieldName) => {
    return emptyFields[fieldName] ? "input-error" : "";
  }; 

/* Ouverture et fermeture de la modal */
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

/* useEffect qui appel mon service pour charger un veloMobile*/
  useEffect(() => {
    console.log(`Appel du service qui va aller charger les données`);
    if (errorMsg !== undefined) {
      RemoteData.loadVelosMobiles()
          .then((remoteVelosMobiles) => {
            console.log(`remoteVelosMobiles : `, remoteVelosMobiles);
            setVelosMobiles(remoteVelosMobiles);
          })
          .catch((error) => {
            console.log(`Erreur attrapée dans useEffect : `, error);
            setErrorMsg(error.toString());
          });
    }
  }, [errorMsg]);

/* Gère la suppression d'un velomobile*/ 
  const handleClickDeleteVeloMobile = (veloMobileToDelete) => {
    console.log(`Dans DeleteVeloMobile- vélomobile à été supprimé`);
    setVelosMobiles(velosMobiles.filter((vm) => vm !== veloMobileToDelete));
    RemoteData.deleteVeloMobile(veloMobileToDelete.id);
  };
/* Pour le changement d'état lorsqu'on ajoute les informations de chaque champ du formulaire de création d'un velo */
  const handleInputCreate = (event) => {
      console.log(event);
    const {name, value} = event.target;
    let isValid = true;

/* Effacer l'état de validation précédent */
    event.target.classList.remove("is-invalid", "is-valid");
/* Logique pour la validation d'un formulaire avec les contraintes dans ValidateData */
    if (ValidateData.checkIfEmpty(value) || ValidateData.checkCharacter(value) || (name === "weight" && !ValidateData.checkWeight(value))) {
      isValid = false;
      setErrorMessage(`Le champ ${name} est vide ou contient un caractère non autorisé.`);
      event.target.classList.add("is-invalid");
    } else if (((name === "model" || name === "photo") && value.length > 20)) {
      isValid = false;
      setErrorMessage(`Le champ ${name} ne peut pas dépasser 20 caractéres `)
      event.target.classList.add("is-invalid");
    } else if (name === "description" && value.length > 500){
      isValid = false;
      setErrorMessage(`Le champ ${name} ne peut pas dépasser 500 caractéres `)
      event.target.classList.add("is-invalid");
    } else if (name === "weight" && value.length > 10) {
      isValid = false;
      setErrorMessage(`Le champ ${name} ne peut pas dépasser 10 chiffres `)
      event.target.classList.add("is-invalid");
    } else {
      isValid = true;
      event.target.classList.add("is-valid");
/* Réinitialiser le message d'erreur lorsque l'entrée est valide.*/
      setErrorMessage("");
    }
/* Met à jour l'état emptyFields pour refléter la validité de chaque champ. */
      Object.keys(emptyFields).forEach((fieldName) => {
          if (fieldName === name) {
              emptyFields[fieldName] = isValid
          }
      })
      setEmptyFields(emptyFields)
/* !!!! Le code pour définir correctement isFormValid en fonction de la validité de tous les champs.*/
      let isFormValid = true;
      Object.values(emptyFields).forEach((isValidField) => {
          if (!isValidField) {
              isFormValid = false;
              return false; // Permet de sortir de la boucle forEach.
          }
      });
/* Boucle for supprime la classe CSS input-error si la variable isFormValid est true */ 
      if (isFormValid) {
          const inputs = document.querySelectorAll('.create');
          for (let i = 0; i < inputs.length;  i++) {
              inputs[i].classList.remove("input-error")
          }
      }
      setIsFormValid(isFormValid);
  };
/* handleSubmitFormPostVeloMobile création de l'événement créer un veloMobile */
  const handleSubmitFormPostVeloMobile = (event) => {
    event.preventDefault();
    console.log(`Formulaire d'ajout soumis`);
/* formData représente les données du formulaire 
  event.target référence à l'objet qui a envoyé l'événement */
    const formData = new FormData(event.target);
/* Création d'un nouvel objet newVeloMobile avec les données collectées du formulaire*/
    const newVeloMobile = {
      model: formData.get("model"),
      description: formData.get("description"),
      weight: formData.get("weight"),
      photo: formData.get("photo"),
    };

    console.log(newVeloMobile);
/* Réinitialise le formulaire */
    event.target.reset();

/* Création du vélo-mobile dans le serveur (fichier JSON) */
    RemoteData.postVeloMobile(newVeloMobile)
        .then((data) => {
          console.log(`data dans products page `);
          setVelosMobiles((currentVelosMobiles) => [...currentVelosMobiles, data]);
          setCreationSuccess("Un nouveau Velo Mobile a été bien ajouté");
          setTimeout( () => {
            setCreationSuccess("");
          }, 4000);
/*Réinitialiser l'état de validation */
          setIsFormValid(false);

/* Réinitialise les champs de validité du formulaire pour la soumission */
          const formElements = event.target.elements;
          for (let i = 0; i < formElements.length; i++) {
            formElements[i].classList.remove("is-invalid", "is-valid", "input-error");
          } 

        })
        .catch((error) => {
          console.error(error);
          setErrorMsg("Une erreur s'est produite lors de l'ajout d'un veloMobile");
          setTimeout(() => {
            setErrorMsg("");
          }, 5000);
        });
  };

  return (

/* Formulaire modal véloMobile */
      <>
        <section className="card p-4 mt-4 bg-light">
          <h2 className="card-header mb-4 border-danger rounded-lg text-primary">
            Produits
          </h2>
          {isLoggedIn && (
              <>
                <div>
                  <button className="btn btn-primary mb-2" onClick={openModal}>
                    Créer un VeloMobile
                  </button>
                  <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="card">
                      <div className="card-body">
                        <form
                            onSubmit={handleSubmitFormPostVeloMobile}
                            action=""
                            id="form"
                        >
                          {errorMessage && (
                              <div className="alert alert-danger" role="alert">
                                {errorMessage}
                              </div>
                          )}
                          <div className="mb-3">
                            <label htmlFor="model" className="form-label">
                              Modèle
                            </label>
                            <input
                                type="text"
                                id="model"
                                onInput={handleInputCreate}
                                name="model"
                                className={`form-control create ${getInputClass("model")}`}
                                defaultValue={""}
                                required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                              Description
                            </label>
                            <textarea
                                name="description"
                                onInput={handleInputCreate}
                                id="description"
                                className={`form-control create ${getInputClass("description")}`}
                                cols="30"
                                rows="3"
                                required
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="weight" className="form-label">
                              Poids
                            </label>
                            <input
                                type="text"
                                onInput={handleInputCreate}
                                id="weight"
                                name="weight"
                                className={`form-control create ${getInputClass("weight")}`}
                                defaultValue={""}
                                required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="photo" className="form-label">
                              Photo
                            </label>
                            <input
                                type="text"
                                onInput={handleInputCreate}
                                id="photo"
                                name="photo"
                                className={`form-control create ${getInputClass("photo")}`}
                                defaultValue={""}
                                required
                            />
                          </div>
 {/* Bouton de soumission désactivé si le formulaire n'est pas valide */}
                          <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                            Créer
                          </button>
                        </form>
                        {creationSuccess && (
                            <div className="alert alert-success mt-3" role="alert">
                              {creationSuccess}
                            </div>
                        )}
                      </div>
                    </div>
                  </Modal>
                </div>
              </>
          )}

          {errorMsg && <h3 className="text-danger"> {errorMsg}</h3>}
{/* Affichage de la liste des véloMobiles et gestion de la suppréssion ou modification dans le components VeloMobile */}
          {velosMobiles &&
              velosMobiles.map((veloMobile) => (
                  <VeloMobile
                      key={veloMobile.id}
                      veloMobile={veloMobile}
                      handleClickDeleteVeloMobile={handleClickDeleteVeloMobile}
                      onUpdate={handleUpdateVeloMobile}
                  />
              ))}
        </section>
      </>
  );
};

export default ProductsPage;
