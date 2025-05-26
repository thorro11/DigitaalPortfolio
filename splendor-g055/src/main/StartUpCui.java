package main;

import cui.SplendorConsoleApplicatie;
import domein.DomeinController;

public class StartUpCui {

	public static void main(String[] args) {
		new SplendorConsoleApplicatie(new DomeinController()).start();
	}

}
