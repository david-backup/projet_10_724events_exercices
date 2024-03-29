import { fireEvent, render, screen } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Events from "./index";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },

    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};

describe("When Events is created", () => { //vérification si la liste des cartes d'évenement est affichée sur les deux pages.
  it("a list of event card is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Events />
      </DataProvider>
    );
    await screen.findByText("avril");
  });
  describe("and an error occured", () => { // affichage d'un message d'erreur en cas d'echec de chargement des données.
    it("an error message is displayed", async () => {
      api.loadData = jest.fn().mockRejectedValue();
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      expect(await screen.findByText("An error occured")).toBeInTheDocument();
    });
  });
  describe("and we select a category", () => {
    it.only("an filtered list is displayed", async () => { // la liste filtée d'événement est affichée?
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      await screen.findByText("Forum #productCON");
      fireEvent(
        await screen.findByTestId("collapse-button-testid"),// cliquer sur le bouton collapse pour afficher les catégories
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      fireEvent(
        (await screen.findAllByText("soirée entreprise"))[0],// cliquer sur la première catégorie
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );

      await screen.findByText("Conférence #productCON"); // Attendre que la carte d'événement correspondante à la catégorie sélectionnée soit affichée
      expect(screen.queryByText("Forum #productCON")).not.toBeInTheDocument(); // Vérifier que l'événement non filtré n'est pas présent dans le DOM
    });
  });

  describe("and we click on an event", () => { // affichage des détails d'un événement sélectionné
    it("the event detail is displayed", async () => {
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );

      fireEvent(
        await screen.findByText("Conférence #productCON"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Attendre que les détails de l'événement sélectionné soient affichés
      await screen.findByText("24-25-26 Février");
      await screen.findByText("1 site web dédié");
    });
  });
});
