package main;

import domein.DomeinController;
import gui.WelkomSchermController;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class StartUp extends Application {

	@Override
	public void start(Stage stage) {
		WelkomSchermController wsc = new WelkomSchermController(new DomeinController());
		Scene s = new Scene(wsc);
		stage.setScene(s);
		stage.show();
		stage.setTitle("Splendor");
	}

	public static void main(String[] args) {
//		SplendorConsoleApplicatie sca = new SplendorConsoleApplicatie(new DomeinController());
//		sca.start();
		launch(args);
	}
}
