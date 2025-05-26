package testen;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import domein.Speler;

class SpelerTest {

	@Test

	void testGeldigeGebruikersnaam() {
		Speler speler = new Speler("Stefaan_DeCock", 1990);
		assertEquals("Stefaan_DeCock", 1990, speler.getGebruikersnaam());
	}

	@Test
	void testOngeldigeGebruikersnaam() {
		assertThrows(IllegalArgumentException.class, () -> {
			new Speler("Stefaan$DeCock", 1990);
		});
	}

	@Test
	void testGebruikersnaamBeginnendZonderLetter() {
		assertThrows(IllegalArgumentException.class, () -> {
			new Speler("123_Stefaan_DeCock", 1990);
		});
	}

	@Test
	void testGeboorteJaarTeJong() {
		assertThrows(IllegalArgumentException.class, () -> {
			new Speler("Stefaan_DeCock", 2018);
		});
	}

	@Test
	void testGeldigeGeboortejaar() {
		Speler speler = new Speler("Stefaan_DeCock", 1990);
		assertEquals(1990, speler.getGeboortejaar());

	}

}
