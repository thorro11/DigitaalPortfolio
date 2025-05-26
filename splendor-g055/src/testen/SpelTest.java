package testen;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import domein.Edele;
import domein.Edelsteenfiche;
import domein.Ontwikkelingskaart;
import domein.Spel;
import domein.Speler;

class SpelTest {
	private static final Edelsteenfiche onyx = new Edelsteenfiche("Onyx");
	private static final Edelsteenfiche diamant = new Edelsteenfiche("Diamant");
	private static final Edelsteenfiche smaragd = new Edelsteenfiche("Smaragd");
	private static final Edelsteenfiche robijn = new Edelsteenfiche("Robijn");
	private static final Edelsteenfiche safier = new Edelsteenfiche("Safier");

	@Test
	void maakSpel_GeldigAantalSpelers_MaaktSpel() {
		Spel s2 = new Spel();
		Spel s3 = new Spel();
		Spel s4 = new Spel();
		switch (s2.getAantalSpelers()) {
		case 2 -> {
			assertEquals(3, s2.beschikbareEdelen.size());
			assertEquals(78, s2.stapelOntwikkelingskaarten.size());
			assertEquals(12, s2.zichtbareOntwikkelingskaarten.size());
			assertEquals(20, s2.beschikbareEdelstenenfiches.size());
		}
		case 3 -> {
			assertEquals(4, s3.beschikbareEdelen.size());
			assertEquals(78, s3.stapelOntwikkelingskaarten.size());
			assertEquals(12, s3.zichtbareOntwikkelingskaarten.size());
			assertEquals(25, s3.beschikbareEdelstenenfiches.size());
		}

		case 4 -> {
			assertEquals(5, s4.beschikbareEdelen.size());
			assertEquals(78, s4.stapelOntwikkelingskaarten.size());
			assertEquals(12, s4.zichtbareOntwikkelingskaarten.size());
			assertEquals(35, s4.beschikbareEdelstenenfiches.size());
		}
		}
	}

	@Test
	void berekenPrestigePuntenPerSpeler() {
		Spel s = new Spel();
		Speler speler = new Speler("speler", 2004);
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Diamant"));
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		assertEquals(3, s.berekenPrestigePuntenPerSpeler(speler));
	}

	@Test
	void isEinde_15Punten_RetourneertTrue() {
		Spel spel = new Spel();
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("speler2", 2004);
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(onyx);
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(diamant);
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		kostprijs.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(robijn);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(onyx);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, onyx, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(diamant);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(safier);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, smaragd, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 7; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, robijn, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kOntwikkelingskaart.add(safier);
		}
		speler2.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kOntwikkelingskaart, 1));
		assertTrue(spel.isEinde());
	}

	@Test
	void isEinde_MeerDan15Punten_RetourneertTrue() {
		Spel spel = new Spel();
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(onyx);
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(diamant);
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		kostprijs.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(robijn);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(onyx);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, onyx, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(diamant);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(safier);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, smaragd, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 7; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, robijn, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(diamant);
		}
		for (int i = 0; i < 7; i++) {
			kOntwikkelingskaart.add(onyx);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, diamant, kOntwikkelingskaart, 5));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kOntwikkelingskaart.add(safier);
		}
		speler2.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kOntwikkelingskaart, 1));
		assertTrue(spel.isEinde());
	}

	@Test
	void isEinde_14Punten_RetourneertFalse() {
		Spel spel = new Spel();
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(onyx);
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(diamant);
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		kostprijs.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(robijn);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(onyx);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, onyx, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(diamant);
		}
		for (int i = 0; i < 6; i++) {
			kOntwikkelingskaart.add(safier);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, smaragd, kOntwikkelingskaart, 4));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(diamant);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(safier);
		}
		for (int i = 0; i < 5; i++) {
			kOntwikkelingskaart.add(smaragd);
		}
		for (int i = 0; i < 3; i++) {
			kOntwikkelingskaart.add(robijn);
		}
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kOntwikkelingskaart.add(safier);
		}
		speler2.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kOntwikkelingskaart, 1));
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(3, onyx, kOntwikkelingskaart, 3));
		assertFalse(spel.isEinde());
	}

	@Test
	void isEinde_MinderDan14Punten_RetourneertFalse() {
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Diamant"));
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		for (int i = 0; i < 4; i++) {
			kOntwikkelingskaart.add(safier);
		}
		speler2.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kOntwikkelingskaart, 1));
		assertFalse(spel.isEinde());
	}

	@Test
	void geefWinnaar_HoogstePunten_1Winnaar() {
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Diamant"));
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			kOntwikkelingskaart.add(new Edelsteenfiche("Diamant"));
		}
		speler2.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(2, new Edelsteenfiche("Onyx"), kOntwikkelingskaart, 2));
		List<Speler> winnaars = new ArrayList<>();
		winnaars.add(speler);
		assertEquals(winnaars, spel.geefWinnaar());
	}

	@Test
	void geefWinnaar_GelijkAantalPunten_1Winnaar() {
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Diamant"));
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		kostprijs.clear();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Robijn"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Smaragd"));
		}
		speler2.edelenInBezit.add(new Edele(3, kostprijs));

		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			kOntwikkelingskaart.add(new Edelsteenfiche("Diamant"));
		}
		speler.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(2, new Edelsteenfiche("Onyx"), kOntwikkelingskaart, 2));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kOntwikkelingskaart.add(new Edelsteenfiche("Smaragd"));
		}
		speler2.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(1, new Edelsteenfiche("Diamant"), kOntwikkelingskaart, 1));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		speler2.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(1, new Edelsteenfiche("Smaragd"), kOntwikkelingskaart, 1));
		List<Speler> winnaars = new ArrayList<>();
		winnaars.add(speler);
		assertEquals(winnaars, spel.geefWinnaar());
	}

	@Test
	void geefWinnaar_GelijkAantalPuntenEnOntwikkelingskaarten_GedeeldeOverwinning() {
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Diamant"));
		}
		speler.edelenInBezit.add(new Edele(3, kostprijs));
		kostprijs.clear();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Robijn"));
		}
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Smaragd"));
		}
		speler2.edelenInBezit.add(new Edele(3, kostprijs));
		List<Edelsteenfiche> kOntwikkelingskaart = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			kOntwikkelingskaart.add(new Edelsteenfiche("Diamant"));
		}
		speler.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(2, new Edelsteenfiche("Onyx"), kOntwikkelingskaart, 2));
		kOntwikkelingskaart.clear();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(new Edelsteenfiche("Onyx"));
		}
		speler2.ontwikkelingskaartenInBezit
				.add(new Ontwikkelingskaart(1, new Edelsteenfiche("Smaragd"), kOntwikkelingskaart, 1));
		List<Speler> winnaars = new ArrayList<>();
		winnaars.add(speler);
		winnaars.add(speler2);
		assertEquals(winnaars, spel.geefWinnaar());
	}

	@Test
	void bepaalStartSpeler_JongsteSpeler() {
		Speler speler = new Speler("s", 2002);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		assertEquals(spel.spelers.indexOf(speler), spel.bepaalStartSpeler());
	}

	@Test
	void bepaalStartSpeler_EvenOud_LangsteGebruikersnaamBegint() {
		Speler speler = new Speler("s", 2002);
		Speler speler2 = new Speler("s2", 2002);
		Spel spel = new Spel();
		assertEquals(spel.spelers.indexOf(speler2), spel.bepaalStartSpeler());
	}

	@Test
	void bepaalStartSpeler_EvenOudEnGebruikesnaamEvenLang_OmgekeerdAlfabetischSorteren() {
		Speler speler = new Speler("s", 2002);
		Speler speler2 = new Speler("t", 2002);
		Spel spel = new Spel();
		assertEquals(spel.spelers.indexOf(speler2), spel.bepaalStartSpeler());
	}

	@Test
	void speelRonde() {
		Speler speler = new Speler("s", 1999);
		Speler speler2 = new Speler("s2", 1999);
		Spel spel = new Spel();
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			kostprijs.add(safier);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kostprijs, 1));
		kostprijs.clear();
		for (int i = 0; i < 3; i++) {
			kostprijs.add(robijn);
		}
		kostprijs.add(onyx);
		kostprijs.add(smaragd);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kostprijs, 0));
		kostprijs.clear();
		for (int i = 0; i < 2; i++) {
			kostprijs.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kostprijs, 0));
		kostprijs.clear();
		for (int i = 0; i < 2; i++) {
			kostprijs.add(diamant);
		}
		for (int i = 0; i < 2; i++) {
			kostprijs.add(smaragd);
		}
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, onyx, kostprijs, 0));
		kostprijs.clear();
		kostprijs.add(safier);
		kostprijs.add(smaragd);
		kostprijs.add(robijn);
		kostprijs.add(onyx);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, diamant, kostprijs, 0));
		kostprijs.clear();
		kostprijs.add(safier);
		for (int i = 0; i < 2; i++) {
			kostprijs.add(smaragd);
		}
		kostprijs.add(robijn);
		kostprijs.add(onyx);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, diamant, kostprijs, 0));
		kostprijs.clear();
		for (int i = 0; i < 2; i++) {
			kostprijs.add(safier);
		}
		for (int i = 0; i < 2; i++) {
			kostprijs.add(smaragd);
		}
		kostprijs.add(onyx);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, diamant, kostprijs, 0));
		kostprijs.clear();
		for (int i = 0; i < 3; i++) {
			kostprijs.add(safier);
		}
		kostprijs.add(onyx);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, diamant, kostprijs, 0));
		kostprijs.clear();
		for (int i = 0; i < 2; i++) {
			kostprijs.add(diamant);
		}
		kostprijs.add(safier);
		kostprijs.add(smaragd);
		kostprijs.add(onyx);
		speler.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, robijn, kostprijs, 0));
		kostprijs.clear();

		for (int i = 0; i < 2; i++) {
			kostprijs.add(diamant);
		}
		kostprijs.add(safier);
		kostprijs.add(smaragd);
		kostprijs.add(onyx);
		speler2.ontwikkelingskaartenInBezit.add(new Ontwikkelingskaart(1, robijn, kostprijs, 0));
		kostprijs.clear();

		spel.speelRonde();
		assertEquals(1, speler.edelenInBezit.size());
		assertEquals(1, speler.ontwikkelingskaartenInBezit.size());
		assertEquals(0, speler2.edelenInBezit.size());
		assertEquals(1, speler2.ontwikkelingskaartenInBezit.size());
	}

}
