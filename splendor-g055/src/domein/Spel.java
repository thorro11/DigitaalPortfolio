package domein;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.ListIterator;
import java.util.stream.Collectors;

public class Spel {

	private Speler startSpeler;
	private Speler spelerAanDeBeurt;
	private List<Ontwikkelingskaart> stapelOntwikkelingskaarten;
	private List<Ontwikkelingskaart> zichtbareOntwikkelingskaarten;
	private List<Edelsteenfiche> beschikbareEdelstenenfiches;
	private List<Edele> beschikbareEdelen;
	private List<Speler> spelers;

	public Spel() {
		this.spelers = new ArrayList<>();
		this.beschikbareEdelen = new ArrayList<>();
		this.beschikbareEdelstenenfiches = new ArrayList<>();
		this.stapelOntwikkelingskaarten = new ArrayList<>();
		this.zichtbareOntwikkelingskaarten = new ArrayList<>();
	}

	public boolean isEinde() {
		for (Speler speler : this.spelers) {
			if (berekenPrestigePuntenPerSpeler(speler) >= 15)
				return true;
		}
		return false;
	}

	public List<Speler> geefWinnaar() {
		List<Speler> winnaars = new ArrayList<>();
		int voorlopigGrootsteAantal = 0, ontwikkelingskaartenSpeler1 = 0;
		Speler winnaar, vorigeSpeler = null;
		for (Speler speler : this.spelers) {
			int aantalPrestigePuntenSpeler = berekenPrestigePuntenPerSpeler(speler);
			if (aantalPrestigePuntenSpeler >= voorlopigGrootsteAantal) {
				if (aantalPrestigePuntenSpeler == voorlopigGrootsteAantal) {
					if (speler.getOntwikkelingskaartenInBezit().size() < ontwikkelingskaartenSpeler1) {
						winnaar = speler;
						winnaars.add(winnaar);
					} else {
						winnaar = vorigeSpeler;
						winnaars.add(winnaar);
					}
					if (speler.getOntwikkelingskaartenInBezit().size() == ontwikkelingskaartenSpeler1) {
						winnaars.add(speler);
						if (!winnaars.contains(vorigeSpeler)) {
							winnaars.add(vorigeSpeler);
						}
					}

				}
				if (aantalPrestigePuntenSpeler > voorlopigGrootsteAantal) {
					winnaar = speler;
					winnaars.add(winnaar);
				}
				voorlopigGrootsteAantal = aantalPrestigePuntenSpeler;
				ontwikkelingskaartenSpeler1 = speler.getOntwikkelingskaartenInBezit().size();
				vorigeSpeler = speler;
			}

		}
		return winnaars;
	}

	public List<String> geefScoreOverzicht() {
		List<String> overzicht = new ArrayList<>();
		for (Speler speler : this.spelers) {
			overzicht.add(speler.getGebruikersnaam() + ": " + berekenPrestigePuntenPerSpeler(speler));
		}
		return overzicht;
	}

	public int bepaalStartSpeler() {
		Collections.sort(this.spelers, Comparator.comparing(Speler::getGeboortejaar, Comparator.reverseOrder()));
		int jongsteGeboortejaar = this.spelers.get(0).getGeboortejaar();
		int i = 0;
		while (i < this.spelers.size() && this.spelers.get(i).getGeboortejaar() == jongsteGeboortejaar) {
			i++;
		}
		List<Speler> jongsteSpelers = this.spelers.subList(0, i);

		if (jongsteSpelers.size() == 1) {
			this.startSpeler = jongsteSpelers.get(0);
			this.spelerAanDeBeurt = jongsteSpelers.get(0);
			return spelers.indexOf(jongsteSpelers.get(0));
		} else {

			Collections.sort(jongsteSpelers, Comparator.comparing(Speler::getGebruikersnaam, Comparator.reverseOrder())
					.thenComparing(Comparator.comparing(Speler::getGebruikersnaam, Comparator.reverseOrder())));
			this.startSpeler = jongsteSpelers.get(0);
			this.spelerAanDeBeurt = jongsteSpelers.get(0);
			return spelers.indexOf(jongsteSpelers.get(0));
		}
	}

	public void bepaalSpelerAanDeBeurt() {
		int indexHuidigeSpeler = this.spelers.indexOf(this.spelerAanDeBeurt);
		int indexVolgendeSpeler = (indexHuidigeSpeler + 1) % this.spelers.size();
		this.spelerAanDeBeurt = this.spelers.get(indexVolgendeSpeler);
		// deze methode geeft de volgende speler. Begint bij de speler na de
		// startspeler. De startspeler wordt al bepaald in de constructor.
	}

	public String toonOverzichtPerSpeler() {
		String overzicht = "";
		List<Speler> spelersKopie = new ArrayList<>(this.spelers);
		ListIterator<Speler> itSpelers = spelersKopie.listIterator();
		while (itSpelers.hasNext()) {
			String ontwikkelingskaarten = "", edelsteenfiches = "", edele = "";
			int smaragd = 0, diamant = 0, safier = 0, onyx = 0, robijn = 0;
			Speler speler = itSpelers.next();
			if (!speler.getOntwikkelingskaartenInBezit().isEmpty()) {
				for (Ontwikkelingskaart o : speler.getOntwikkelingskaartenInBezit()) {
					ontwikkelingskaarten += String.format("- niveau: %s - %s", o.getNiveau(), o.toString());
				}
			} else {
				ontwikkelingskaarten = String.format("geen ontwikkelingskaarten in bezit");
			}

			if (!speler.edelstenenfichesInBezit.isEmpty()) {
				edelsteenfiches = toonOverzichtEdelsteenfiches(speler.edelstenenfichesInBezit);
			} else {
				edelsteenfiches = String.format("geen edelsteenfiches in bezit");
			}

			if (!speler.getEdelenInBezit().isEmpty()) {
				for (Edele ed : speler.getEdelenInBezit()) {
					edele += ed.toString();
				}
			} else {
				edele = String.format("geen edelen in bezit");
			}
			overzicht += String.format(
					" - gebruikersnaam: %s%n - totaal aantal prestigepunten: %d%n - aan de beurt: %s%n - is startspeler: %s%n - ontwikkelingskaarten in bezit: %s%n - hoeveelheid edelsteenfiches per type in bezit: %s%n - edelen in bezit: %s%n%n",
					speler.getGebruikersnaam(), berekenPrestigePuntenPerSpeler(speler),
					spelerAanDeBeurt.equals(speler) ? "ja" : "nee", this.startSpeler.equals(speler) ? "ja" : "nee",
					ontwikkelingskaarten, edelsteenfiches, edele);
		}
		return overzicht;
	}

	public String toonOverzichtSpel() {
		String edelen = "";

		for (Edele e : this.beschikbareEdelen) {
			edelen += e.toString();
		}

		String ontwikkelingskaarten = toonOverzichtBeschikbareOntwikkelingskaarten();

		String edelsteenfiches = toonOverzichtEdelsteenfiches(this.beschikbareEdelstenenfiches);

		return String.format("beschikbare edelen:%n %s%n%n%s%nbeschikbare edelsteenfiches: %s%n%n", edelen,
				ontwikkelingskaarten, edelsteenfiches);
	}

	public String toonOverzichtBeschikbareOntwikkelingskaarten() {
		String ontwikkelingskaartenZichtbaarN1String = "", ontwikkelingskaartenStapelN1String = "",
				ontwikkelingskaartenZichtbaarN2String = "", ontwikkelingskaartenStapelN2String = "",
				ontwikkelingskaartenZichtbaarN3String = "", ontwikkelingskaartenStapelN3String = "";
		List<Ontwikkelingskaart> ontwikkelingskaartenStapelN1 = stapelOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 1).collect(Collectors.toList());
		List<Ontwikkelingskaart> ontwikkelingskaartenStapelN2 = stapelOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 2).collect(Collectors.toList());
		List<Ontwikkelingskaart> ontwikkelingskaartenStapelN3 = stapelOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 3).collect(Collectors.toList());
		List<Ontwikkelingskaart> ontwZichtbaarN1 = zichtbareOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 1).collect(Collectors.toList());
		List<Ontwikkelingskaart> ontwZichtbaarN2 = zichtbareOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 2).collect(Collectors.toList());
		List<Ontwikkelingskaart> ontwZichtbaarN3 = zichtbareOntwikkelingskaarten.stream()
				.filter(o -> o.getNiveau() == 3).collect(Collectors.toList());

		for (Ontwikkelingskaart o : ontwZichtbaarN1) {
			ontwikkelingskaartenZichtbaarN1String += o.toString();
		}
		for (Ontwikkelingskaart o : ontwikkelingskaartenStapelN1) {
			ontwikkelingskaartenStapelN1String += o.toString();
		}

		for (Ontwikkelingskaart o : ontwZichtbaarN2) {
			ontwikkelingskaartenZichtbaarN2String += o.toString();
		}
		for (Ontwikkelingskaart o : ontwikkelingskaartenStapelN2) {
			ontwikkelingskaartenStapelN2String += o.toString();
		}

		for (Ontwikkelingskaart o : ontwZichtbaarN3) {
			ontwikkelingskaartenZichtbaarN3String += o.toString();
		}
		for (Ontwikkelingskaart o : ontwikkelingskaartenStapelN3) {
			ontwikkelingskaartenStapelN3String += o.toString();
		}
		return String.format(
				"stapel kaarten niveau 1:%n %s%nzichtbare kaarten niveau 1:%n %s%nstapel kaarten niveau 2:%n %s%nzichtbare kaarten niveau 2:%n %s%nstapel kaarten niveau 3:%n %s%nzichtbare kaarten niveau 3:%n %s%n",
				ontwikkelingskaartenStapelN1String, ontwikkelingskaartenZichtbaarN1String,
				ontwikkelingskaartenStapelN2String, ontwikkelingskaartenZichtbaarN2String,
				ontwikkelingskaartenStapelN3String, ontwikkelingskaartenZichtbaarN3String);
	}

	public String toonOverzichtEdelsteenfiches(List<Edelsteenfiche> edelsteenfichesList) {
		String edelsteenfiches = "";
		int smaragd = 0, diamant = 0, safier = 0, onyx = 0, robijn = 0;
		for (Edelsteenfiche e : edelsteenfichesList) {
			if (e.getSoort().equals("Smaragd"))
				smaragd++;
			if (e.getSoort().equals("Diamant"))
				diamant++;
			if (e.getSoort().equals("Safier"))
				safier++;
			if (e.getSoort().equals("Onyx"))
				onyx++;
			if (e.getSoort().equals("Robijn"))
				robijn++;
		}
		return edelsteenfiches = String.format("%n %dx Smaragd %dx Diamant %dx Safier %dx Onyx %dx Robijn", smaragd,
				diamant, safier, onyx, robijn);
	}

	public List<Edele> beschikbareSpecialeTegels() {
		List<Edele> edelen = new ArrayList<>();
		List<Edelsteenfiche> bonussenVanOntwikkelingskaartenSpeler = new ArrayList<>();
		for (Ontwikkelingskaart ontw : this.spelerAanDeBeurt.getOntwikkelingskaartenInBezit()) {
			bonussenVanOntwikkelingskaartenSpeler.add(ontw.getBonus());
		}
		for (Edele edele : this.beschikbareEdelen) {
			if (bonussenVanOntwikkelingskaartenSpeler.containsAll(edele.getKostprijs())) {
				edelen.add(edele);
			}
		}
		return edelen;
	}

	public void koopOntwikkelingskaart(Ontwikkelingskaart ontwikkelingskaart) {
		List<Edelsteenfiche> bonussen = new ArrayList<>();
		if (this.zichtbareOntwikkelingskaarten.contains(ontwikkelingskaart)) {
			if (!this.spelerAanDeBeurt.getOntwikkelingskaartenInBezit().isEmpty()) {
				for (Ontwikkelingskaart ontw : this.spelerAanDeBeurt.getOntwikkelingskaartenInBezit()) {
					bonussen.add(ontw.getBonus());
				}
				bonussen.forEach(b -> ontwikkelingskaart.getKostprijs().remove(b));
			}
			if (this.spelerAanDeBeurt.edelstenenfichesInBezit.containsAll(ontwikkelingskaart.getKostprijs())) {
				this.spelerAanDeBeurt.setOntwikkelingskaartenInBezit(ontwikkelingskaart);
				this.zichtbareOntwikkelingskaarten.remove(ontwikkelingskaart);
				for (Ontwikkelingskaart ontw : this.stapelOntwikkelingskaarten) {
					if (ontw.getNiveau() == ontwikkelingskaart.getNiveau()) {
						this.stapelOntwikkelingskaarten.remove(ontw);
						this.zichtbareOntwikkelingskaarten.add(ontw);
						break;
					}
				}
				ontwikkelingskaart.getKostprijs().forEach(e -> this.spelerAanDeBeurt.edelstenenfichesInBezit.remove(e));
				this.beschikbareEdelstenenfiches.addAll(ontwikkelingskaart.getKostprijs());
			} else {
				throw new IllegalArgumentException(
						"Je hebt te weinig edelsteenfiches om deze ontwikkelingskaart te kopen");
			}

		} else {
			throw new IllegalArgumentException(
					"Je kan geen ontwikkelingskaart nemen van de stapel. Kies een dat op de tafel ligt!");
		}
	}

	public void kiesSpecialeTegel(Edele specialeTegel) {
		this.spelerAanDeBeurt.getEdelenInBezit()
				.add(this.beschikbareEdelen.remove(this.beschikbareEdelen.indexOf(specialeTegel)));
	}

	public void neemEdelsteenfiches(List<Edelsteenfiche> edelsteenfiches) {
		if (edelsteenfiches.size() == 1) {
			this.beschikbareEdelstenenfiches.remove(edelsteenfiches.get(0));
			this.spelerAanDeBeurt.edelstenenfichesInBezit.add(edelsteenfiches.get(0));
		} else {
			if (edelsteenfiches.size() == 2) {
				edelsteenfiches.forEach(e -> {
					this.beschikbareEdelstenenfiches.remove(e);
				});
				if (edelsteenfiches.get(0).getSoort().equals(edelsteenfiches.get(1).getSoort())
						&& this.beschikbareEdelstenenfiches.containsAll(edelsteenfiches)) {
					this.spelerAanDeBeurt.edelstenenfichesInBezit.addAll(edelsteenfiches);
				} else {
					this.beschikbareEdelstenenfiches.addAll(edelsteenfiches);
					throw new IllegalArgumentException(
							"De edelsteenfiches moeten van eenzelfde kleur zijn en er moeten minstens 2 edelsteenfiches van diezelfde kleur in de voorraad van het spel achterblijven");
				}
			} else {
				if (edelsteenfiches.size() == 3) {
					if (edelsteenfiches.get(0).getSoort().equals(edelsteenfiches.get(1).getSoort())
							|| edelsteenfiches.get(0).getSoort().equals(edelsteenfiches.get(2).getSoort())
							|| edelsteenfiches.get(1).getSoort().equals(edelsteenfiches.get(2).getSoort())) {
						throw new IllegalArgumentException(
								"De 3 gekozen edelsteenfiches moeten van een verschillende kleur zijn");
					} else {
						edelsteenfiches.forEach(e -> {
							this.beschikbareEdelstenenfiches.remove(e);
							this.spelerAanDeBeurt.edelstenenfichesInBezit.add(e);
						});
					}
				} else {
					throw new IllegalArgumentException(
							" Neem tot maximaal 3 edelsteenfiches, elk van een verschillende kleur of neem 2 edelsteenfiches van eenzelfde kleur");
				}
			}

		}
	}

	public boolean controleerAantalEdelsteenfichesInVoorraad() {
		if (this.spelerAanDeBeurt.edelstenenfichesInBezit.size() > 10)
			return true;
		else
			return false;
	}

	public void geefEdelsteenfichesTerug(List<Edelsteenfiche> edelsteenfiches) {
		edelsteenfiches.forEach(e -> this.spelerAanDeBeurt.edelstenenfichesInBezit.remove(e));
		if (this.spelerAanDeBeurt.edelstenenfichesInBezit.size() == 10) {
			this.beschikbareEdelstenenfiches.addAll(edelsteenfiches);
		} else {
			this.spelerAanDeBeurt.edelstenenfichesInBezit.addAll(edelsteenfiches);
			throw new IllegalArgumentException("Na teruggave moet je 10 edelsteenfiches overhouden in je voorraad");
		}

	}

	public int berekenPrestigePuntenPerSpeler(Speler speler) {
		int aantalPrestigePunten = 0;
		for (Ontwikkelingskaart ontw : speler.getOntwikkelingskaartenInBezit()) {
			aantalPrestigePunten += ontw.getAantalPrestigePunten();
		}
		for (Edele edele : speler.getEdelenInBezit()) {
			aantalPrestigePunten += edele.getPrestigePunten();
		}
		return aantalPrestigePunten;

	}

	public void maakKaartenAan() {
		int aantalKeer = 0;
		switch (spelers.size()) {
		case 2 -> {
			aantalKeer = 4;
		}
		case 3 -> {
			aantalKeer = 5;
		}
		case 4 -> {
			aantalKeer = 7;
		}
		}

		Edelsteenfiche smaragd = new Edelsteenfiche("Smaragd");
		Edelsteenfiche diamant = new Edelsteenfiche("Diamant");
		Edelsteenfiche safier = new Edelsteenfiche("Safier");
		Edelsteenfiche onyx = new Edelsteenfiche("Onyx");
		Edelsteenfiche robijn = new Edelsteenfiche("Robijn");
		for (int i = 0; i < aantalKeer; i++) {
			beschikbareEdelstenenfiches.add(smaragd);
			beschikbareEdelstenenfiches.add(diamant);
			beschikbareEdelstenenfiches.add(safier);
			beschikbareEdelstenenfiches.add(onyx);
			beschikbareEdelstenenfiches.add(robijn);
		}

		// niveau 1
		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(safier, safier, safier, safier), 1));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(diamant, smaragd, robijn, robijn, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, safier, Arrays.asList(onyx, onyx, diamant), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(robijn, robijn, robijn, onyx, smaragd), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, diamant, diamant), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, diamant, smaragd, onyx, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(diamant, diamant, safier), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(smaragd, smaragd), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(safier, safier, onyx, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(robijn, robijn, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, robijn, onyx, onyx, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(safier, safier, smaragd), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(diamant, diamant, smaragd, smaragd), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(diamant, safier, robijn, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(safier, smaragd, robijn, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(diamant, diamant, safier, safier, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(diamant, safier, safier, safier, smaragd), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(safier, smaragd, smaragd, robijn, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(safier, safier, smaragd, smaragd, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(safier, safier, safier, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(diamant, safier, smaragd, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(diamant, diamant, diamant, safier, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(smaragd, smaragd, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(safier, robijn, robijn, onyx, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, safier, Arrays.asList(onyx, onyx, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, diamant, safier, smaragd, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(diamant, safier, robijn, onyx, onyx), 0));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(robijn, robijn, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(safier, smaragd, smaragd, smaragd, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(diamant, smaragd, smaragd, robijn, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, diamant, Arrays.asList(smaragd, smaragd, smaragd, smaragd), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(onyx, onyx, onyx, onyx), 1));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, smaragd, Arrays.asList(safier, safier, robijn, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, diamant, robijn, robijn), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, diamant, diamant, diamant), 1));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(smaragd, smaragd, onyx, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(diamant, smaragd, robijn, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, safier, Arrays.asList(robijn, robijn, robijn, robijn), 1));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, robijn, Arrays.asList(diamant, safier, smaragd, onyx), 0));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(1, onyx, Arrays.asList(diamant, safier, safier, smaragd, robijn), 0));

		// niveau 2

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, onyx, Arrays.asList(diamant, diamant, diamant, diamant, diamant), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, onyx,
				Arrays.asList(diamant, diamant, diamant, safier, safier, smaragd, smaragd), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, robijn,
				Arrays.asList(safier, safier, safier, robijn, robijn, onyx, onyx, onyx), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(diamant, diamant, safier, safier, safier, onyx, onyx), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, diamant,
				Arrays.asList(smaragd, robijn, robijn, robijn, robijn, onyx, onyx), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, diamant,
				Arrays.asList(diamant, diamant, safier, safier, safier, robijn, robijn, robijn), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(diamant, diamant, diamant, smaragd, smaragd, robijn, robijn, robijn), 1));

		stapelOntwikkelingskaarten.add(
				new Ontwikkelingskaart(2, safier, Arrays.asList(diamant, diamant, robijn, onyx, onyx, onyx, onyx), 2));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, robijn, Arrays.asList(onyx, onyx, onyx, onyx, onyx), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(diamant, diamant, diamant, robijn, onyx, onyx, onyx, onyx, onyx), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, safier,
				Arrays.asList(safier, safier, smaragd, smaragd, smaragd, onyx, onyx, onyx), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, robijn,
				Arrays.asList(diamant, diamant, robijn, robijn, onyx, onyx, onyx), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(smaragd, smaragd, smaragd, smaragd, smaragd, smaragd), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, robijn,
				Arrays.asList(diamant, safier, safier, safier, safier, smaragd, smaragd), 2));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, safier, Arrays.asList(safier, safier, safier, safier, safier), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(safier, safier, safier, safier, safier, smaragd, smaragd, smaragd), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, smaragd,
				Arrays.asList(diamant, diamant, diamant, diamant, safier, safier, onyx), 2));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, diamant, Arrays.asList(robijn, robijn, robijn, robijn, robijn), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, diamant,
				Arrays.asList(diamant, diamant, diamant, diamant, diamant, diamant), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, onyx,
				Arrays.asList(safier, smaragd, smaragd, smaragd, smaragd, robijn, robijn), 2));

		stapelOntwikkelingskaarten.add(
				new Ontwikkelingskaart(2, safier, Arrays.asList(safier, safier, safier, safier, safier, safier), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, onyx,
				Arrays.asList(smaragd, smaragd, smaragd, smaragd, smaragd, robijn, robijn, robijn), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, diamant,
				Arrays.asList(smaragd, smaragd, smaragd, robijn, robijn, onyx, onyx), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, safier,
				Arrays.asList(safier, safier, smaragd, smaragd, robijn, robijn, robijn), 1));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, onyx,
				Arrays.asList(diamant, diamant, diamant, smaragd, smaragd, onyx, onyx), 1));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, smaragd, Arrays.asList(smaragd, smaragd, smaragd, smaragd, smaragd), 2));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, diamant,
				Arrays.asList(robijn, robijn, robijn, robijn, robijn, onyx, onyx, onyx), 2));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(2, onyx, Arrays.asList(onyx, onyx, onyx, onyx, onyx, onyx), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(2, safier,
				Arrays.asList(diamant, diamant, diamant, diamant, diamant, safier, safier, safier), 2));

		stapelOntwikkelingskaarten.add(
				new Ontwikkelingskaart(2, robijn, Arrays.asList(robijn, robijn, robijn, robijn, robijn, robijn), 3));

		// niveau 3

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, robijn, Arrays.asList(safier, safier, safier, smaragd,
				smaragd, smaragd, smaragd, smaragd, smaragd, robijn, robijn, robijn), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, onyx,
				Arrays.asList(robijn, robijn, robijn, robijn, robijn, robijn, robijn, onyx, onyx, onyx), 5));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, onyx, Arrays.asList(smaragd, smaragd, smaragd, robijn,
				robijn, robijn, robijn, robijn, robijn, onyx, onyx, onyx), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, smaragd, Arrays.asList(diamant, diamant, diamant,
				safier, safier, safier, safier, safier, safier, smaragd, smaragd, smaragd), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, diamant,
				Arrays.asList(diamant, diamant, diamant, onyx, onyx, onyx, onyx, onyx, onyx, onyx), 5));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, diamant, Arrays.asList(safier, safier, safier, smaragd,
				smaragd, smaragd, robijn, robijn, robijn, robijn, robijn, onyx, onyx, onyx), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, robijn,
				Arrays.asList(smaragd, smaragd, smaragd, smaragd, smaragd, smaragd, smaragd, robijn, robijn, robijn),
				5));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, safier, Arrays.asList(diamant, diamant, diamant,
				smaragd, smaragd, smaragd, robijn, robijn, robijn, robijn, robijn, onyx, onyx, onyx, onyx, onyx), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, smaragd, Arrays.asList(diamant, diamant, diamant,
				diamant, diamant, safier, safier, safier, robijn, robijn, robijn, onyx, onyx, onyx), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, robijn,
				Arrays.asList(smaragd, smaragd, smaragd, smaragd, smaragd, smaragd, smaragd), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, safier,
				Arrays.asList(diamant, diamant, diamant, diamant, diamant, diamant, diamant), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, onyx,
				Arrays.asList(robijn, robijn, robijn, robijn, robijn, robijn, robijn), 4));

		stapelOntwikkelingskaarten
				.add(new Ontwikkelingskaart(3, diamant, Arrays.asList(onyx, onyx, onyx, onyx, onyx, onyx, onyx), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, smaragd,
				Arrays.asList(safier, safier, safier, safier, safier, safier, safier, smaragd, smaragd, smaragd), 5));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, diamant,
				Arrays.asList(diamant, diamant, diamant, robijn, robijn, robijn, onyx, onyx, onyx), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, safier, Arrays.asList(diamant, diamant, diamant,
				diamant, diamant, diamant, safier, safier, safier, onyx, onyx, onyx), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, smaragd,
				Arrays.asList(safier, safier, safier, safier, safier, safier, safier), 4));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, onyx, Arrays.asList(diamant, diamant, diamant, safier,
				safier, safier, smaragd, smaragd, smaragd, smaragd, smaragd, robijn, robijn, robijn), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, robijn, Arrays.asList(diamant, diamant, diamant,
				safier, safier, safier, safier, safier, smaragd, smaragd, smaragd, onyx, onyx, onyx), 3));

		stapelOntwikkelingskaarten.add(new Ontwikkelingskaart(3, robijn,
				Arrays.asList(diamant, diamant, diamant, diamant, diamant, diamant, diamant, safier, safier, safier),
				5));

		Collections.shuffle(stapelOntwikkelingskaarten);

		List<Ontwikkelingskaart> niv1 = stapelOntwikkelingskaarten.stream().filter(ontw -> ontw.getNiveau() == 1)
				.limit(4).collect(Collectors.toList());
		stapelOntwikkelingskaarten.removeAll(niv1);
		zichtbareOntwikkelingskaarten.addAll(niv1);

		List<Ontwikkelingskaart> niv2 = stapelOntwikkelingskaarten.stream().filter(ontw -> ontw.getNiveau() == 2)
				.limit(4).collect(Collectors.toList());
		stapelOntwikkelingskaarten.removeAll(niv2);
		zichtbareOntwikkelingskaarten.addAll(niv2);

		List<Ontwikkelingskaart> niv3 = stapelOntwikkelingskaarten.stream().filter(ontw -> ontw.getNiveau() == 3)
				.limit(4).collect(Collectors.toList());
		stapelOntwikkelingskaarten.removeAll(niv3);
		zichtbareOntwikkelingskaarten.addAll(niv3);

// edelen
		beschikbareEdelen.add(new Edele(3, Arrays.asList(onyx, onyx, onyx, onyx, diamant, diamant, diamant, diamant)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(onyx, onyx, onyx, robijn, robijn, robijn, diamant, diamant, diamant)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(onyx, onyx, onyx, safier, safier, safier, diamant, diamant, diamant)));

		beschikbareEdelen.add(new Edele(3,
				Arrays.asList(smaragd, smaragd, smaragd, safier, safier, safier, diamant, diamant, diamant)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(onyx, onyx, onyx, robijn, robijn, robijn, smaragd, smaragd, smaragd)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(smaragd, smaragd, smaragd, safier, safier, robijn, robijn, robijn)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(safier, safier, safier, safier, smaragd, smaragd, smaragd, smaragd)));

		beschikbareEdelen.add(new Edele(3, Arrays.asList(onyx, onyx, onyx, onyx, robijn, robijn, robijn, robijn)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(safier, safier, safier, safier, diamant, diamant, diamant, diamant)));

		beschikbareEdelen
				.add(new Edele(3, Arrays.asList(robijn, robijn, robijn, robijn, smaragd, smaragd, smaragd, smaragd)));

		if (spelers.size() == 2) {
			Edele[] arr = new Edele[3];
			for (int i = 0; i < 3; i++) {
				arr[i] = beschikbareEdelen.get(i);
			}
			List<Edele> tijdelijk = new ArrayList<>(Arrays.asList(arr));
			beschikbareEdelen = tijdelijk;
		} else {
			if (spelers.size() == 3) {
				Edele[] arr = new Edele[4];
				for (int i = 0; i < 4; i++) {
					arr[i] = beschikbareEdelen.get(i);
				}
				List<Edele> tijdelijk = new ArrayList<>(Arrays.asList(arr));
				beschikbareEdelen = tijdelijk;
			} else {
				if (spelers.size() == 4) {
					Edele[] arr = new Edele[5];
					for (int i = 0; i < 5; i++) {
						arr[i] = beschikbareEdelen.get(i);
					}
					List<Edele> tijdelijk = new ArrayList<>(Arrays.asList(arr));
					beschikbareEdelen = tijdelijk;
				}
			}
		}
	}

	public List<Ontwikkelingskaart> getOntwikkelingskaartenInBezitSpelerAanDeBeurt() {
		return spelerAanDeBeurt.getOntwikkelingskaartenInBezit();
	}

	public void voegSpelerToe(Speler speler) {
		this.spelers.add(speler);
	}

	public List<Edelsteenfiche> getBeschikbareEdelstenenfiches() {
		return beschikbareEdelstenenfiches;
	}

	public Speler getSpelerAanDeBeurt() {
		return this.spelerAanDeBeurt;
	}

	public List<Speler> getSpelers() {
		return this.spelers;
	}

	public int getAantalSpelers() {
		return this.spelers.size();
	}
}
