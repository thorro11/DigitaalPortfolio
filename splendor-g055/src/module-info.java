module splendor {
	exports persistentie;
	exports cui;
	exports gui;
	exports main;
	exports domein;
	exports testen;
	exports exceptions;

	requires java.sql;
	requires javafx.base;
	requires javafx.controls;
	requires javafx.fxml;
	requires javafx.graphics;
	requires junit;
	requires org.junit.jupiter.api;

	opens main to javafx.fxml, javafx.graphics;
	opens gui to javafx.fxml, javafx.graphics; // scenebuilder
}