package gui;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import domein.DomeinController;
import domein.Speler;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;

public class SpelersToevoegenController extends GridPane {

	@FXML
	private ListView<String> overzichtSpelers;

	@FXML
	private Button startBtn;

	@FXML
	private TextField txfGeboortejaar;

	@FXML
	private TextField txfGebruikersnaam;

	@FXML
	private Button voegToeBtn;
	private DomeinController dc;
	List<Speler> spelers = new ArrayList<>();
	Speler speler = null;

	public SpelersToevoegenController(DomeinController dc) {
		this.dc = dc;
		FXMLLoader loader = new FXMLLoader(getClass().getResource("SpelersToevoegen.fxml"));
		loader.setController(this);
		loader.setRoot(this);
		switch (dc.getTaal()) {
		case "nl" -> loader.setResources(ResourceBundle.getBundle("/resources/gui"));
		case "en" -> loader.setResources(ResourceBundle.getBundle("/resources/gui_en"));
		}
		try {
			loader.load();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Spelerstoevoegenscherm kan niet worden geladen");
		}
	}

	@FXML
	void startSpel(ActionEvent event) {
		dc.nieuwSpel(spelers);
	}

	@FXML
	void voegSpelerToeAanLijst(ActionEvent event) {
		String gebruikersnaam = txfGebruikersnaam.getText();
		int geboortejaar = Integer.parseInt(txfGeboortejaar.getText());
		try {
			speler = dc.registreerGebruiker(gebruikersnaam, geboortejaar);
			overzichtSpelers.getItems().add(gebruikersnaam);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("De opgegeven spelers bevind zicht niet in de databank");
		}
		spelers.add(speler);

	}

}
