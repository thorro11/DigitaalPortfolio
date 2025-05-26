package gui;

import java.util.ResourceBundle;

import domein.DomeinController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ToggleButton;
import javafx.scene.layout.GridPane;
import javafx.stage.Stage;

public class WelkomSchermController extends GridPane {

	@FXML
	private Button startBtn;

	@FXML
	private ToggleButton taalBtn;
	private final DomeinController dc;
	private FXMLLoader loader;

	public WelkomSchermController(DomeinController dc) {
		this.dc = dc;
		loader = new FXMLLoader(getClass().getResource("WelkomScherm.fxml"));
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
			System.out.println("WelkomScherm kan niet worden geladen");
		}
	}

	@FXML
	void startApplicatie(ActionEvent event) {
		SpelersToevoegenController stc = new SpelersToevoegenController(dc);
		Scene scene = new Scene(stc, 600, 400);
		Stage stage = (Stage) this.getScene().getWindow();
		stage.setScene(scene);
		stage.show();
	}

	@FXML
	void veranderTaal(ActionEvent event) {
		dc.setTaal("en");
		switch (dc.getTaal()) {
		case "nl" -> loader.setResources(ResourceBundle.getBundle("/resources/gui"));
		case "en" -> loader.setResources(ResourceBundle.getBundle("/resources/gui_en"));
		}
		try {
			loader.load();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
