package domein;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

public class Speler {

	public List<Edelsteenfiche> edelstenenfichesInBezit;
	private List<Ontwikkelingskaart> ontwikkelingskaartenInBezit;
	private List<Edele> edelenInBezit;
	private String gebruikersnaam;
	private int geboortejaar;

	public Speler(String gebruikersnaam, int geboortejaar) {
		setGebruikersnaam(gebruikersnaam);
		setGeboortejaar(geboortejaar);
		edelstenenfichesInBezit = new ArrayList<>();
		ontwikkelingskaartenInBezit = new ArrayList<>();
		edelenInBezit = new ArrayList<>();
	}

	public String getGebruikersnaam() {
		return this.gebruikersnaam;
	}

	public int getGeboortejaar() {
		return this.geboortejaar;
	}

	public void setGebruikersnaam(String gebruikersnaam) {
		if (gebruikersnaam.matches("^[a-zA-Z][a-zA-Z0-9_\\s]*$")) {
			this.gebruikersnaam = gebruikersnaam;
		} else {
			System.out.println("De gebruikersnaam voldoet niet aan de vereisten");
		}

	}

	public void setGeboortejaar(int geboortejaar) {
		int year = Year.now().getValue();
		if (year - geboortejaar < 6) {
			throw new IllegalArgumentException("Je bent te jong om te spelen");
		} else
			this.geboortejaar = geboortejaar;
	}

	public List<Ontwikkelingskaart> getOntwikkelingskaartenInBezit() {
		return this.ontwikkelingskaartenInBezit;
	}

	public void setOntwikkelingskaartenInBezit(Ontwikkelingskaart ontw) {
		this.ontwikkelingskaartenInBezit.add(ontw);
	}

	public List<Edelsteenfiche> getEdelstenenfichesInBezit() {
		return edelstenenfichesInBezit;
	}

	public List<Edele> getEdelenInBezit() {
		return edelenInBezit;
	}
}
