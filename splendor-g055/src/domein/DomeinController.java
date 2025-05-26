package domein;

import java.util.List;

public class DomeinController {

	private Spel spel;
	private SpelerRepository spelerRepo;
	private String taal;

	public DomeinController() {
	}

	public void startSpel() {
		spelerRepo = new SpelerRepository();
		spel = new Spel();
		setTaal("nl");
	}

	public String getTaal() {
		return taal;
	}

	public void setTaal(String taal) {
		this.taal = taal;
	}

	public void registreerGebruiker(String gebruikersnaam, int geboortejaar) {
		Speler gevondenSpeler = spelerRepo.haalSpelerOp(gebruikersnaam, geboortejaar);
		spel.voegSpelerToe(gevondenSpeler);
	}

	public String toonOverzichtPerSpeler() {
		return spel.toonOverzichtPerSpeler();
	}

	public String toonOverzichtSpel() {
		return spel.toonOverzichtSpel();

	}

	public List<String> geefScoreOverzicht() {
		return spel.geefScoreOverzicht();

	}

	public String toonBeschikbareSpecialeTegels() {
		String edele = "", kostprijs = "";
		if (spel.beschikbareSpecialeTegels().isEmpty()) {
			edele = "geen beschikbare speciale tegels";
		} else {
			for (Edele ed : spel.beschikbareSpecialeTegels()) {
				for (Edelsteenfiche e : ed.getKostprijs()) {
					kostprijs += String.format("%s%n", e.getSoort());
				}
				edele += String.format("%nprestigepunten: %d - kostprijs: %s", ed.getPrestigePunten(), kostprijs);
			}
		}
		return edele;
	}

	public void kiesSpecialeTegel(Edele specialeTegel) {
		spel.kiesSpecialeTegel(specialeTegel);
	}

	public void neemEdelsteenfiche(List<Edelsteenfiche> edelsteenfiches) {
		spel.neemEdelsteenfiches(edelsteenfiches);
	}

	public void geefEdelsteenfichesTerug(List<Edelsteenfiche> edelsteenfiches) {
		spel.geefEdelsteenfichesTerug(edelsteenfiches);
	}

	public List<Speler> geefWinnaar() {
		return spel.geefWinnaar();
	}

	public boolean isEinde() {
		return spel.isEinde();
	}

	public void bepaalSpelerAanDeBeurt() {
		spel.bepaalSpelerAanDeBeurt();
	}

	public String toonOverzichtBeschikbareEdelsteenfiches() {
		return spel.toonOverzichtEdelsteenfiches(spel.getBeschikbareEdelstenenfiches());
	}

	public String toonOverzichtBischikbareOntwikkelingskaarten() {
		return spel.toonOverzichtBeschikbareOntwikkelingskaarten();

	}

	public boolean controleerAantalEdelsteenfichesInVoorraad() {
		return spel.controleerAantalEdelsteenfichesInVoorraad();
	}

	public void koopOntwikkelingskaart(Ontwikkelingskaart ontwikkelingskaart) {
		spel.koopOntwikkelingskaart(ontwikkelingskaart);
	}

	public Speler bepaalStartSpeler() {
		int index = spel.bepaalStartSpeler();
		return spel.getSpelers().get(index);
	}

	public Speler getSpelerAanDeBeurt() {
		return spel.getSpelerAanDeBeurt();
	}

	public List<Speler> getSpelers() {
		return spel.getSpelers();
	}

	public String toonOverzichtEdelsteenfichesInVoorraadSpeler() {
		return spel.toonOverzichtEdelsteenfiches(spel.getSpelerAanDeBeurt().getEdelstenenfichesInBezit());
	}

	public List<Ontwikkelingskaart> getOntwikkelingskaartenInBezitSpelerAanDeBeurt() {
		return spel.getOntwikkelingskaartenInBezitSpelerAanDeBeurt();
	}

	public void maakKaartenAan() {
		spel.maakKaartenAan();
	}
}
