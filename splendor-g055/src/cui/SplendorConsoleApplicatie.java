package cui;

import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

import domein.DomeinController;
import domein.Edele;
import domein.Edelsteenfiche;
import domein.Ontwikkelingskaart;
import domein.Speler;

public class SplendorConsoleApplicatie {

	private Scanner s = new Scanner(System.in);
	private DomeinController dc;

	public SplendorConsoleApplicatie(DomeinController dc) {
		this.dc = dc;
	}

	public void start() {
		dc.startSpel();
		voegSpelersToe();
		dc.maakKaartenAan();
		speelSpel();
	}

	public void voegSpelersToe() {
		int keuze = 1;
		int teller = 0;
		int geboortejaar = 0;
		boolean stop = true;
		Speler speler = null;
		List<Speler> spelers = new ArrayList<>();

		do {
			do {
				System.out.print("Geef je gebruikersnaam: ");
				String gebruikersnaam = s.next();

				do {
					try {
						System.out.print("Geef je geboortejaar: ");
						geboortejaar = s.nextInt();
						stop = false;
					} catch (InputMismatchException e) {
						System.out.println("Geboortejaar moet een getal zijn");
						s.nextLine();
					}
				} while (stop);

				try {
					dc.registreerGebruiker(gebruikersnaam, geboortejaar);
					System.out.printf("Speler is toegevoegd aan het spel%n");
				} catch (Exception e) {
					System.out.println("De opgegeven speler bevindt zich niet in de databank");
				}

				stop = true;
				do {
					System.out.print("Wilt u nog iemand toevoegen? Zo ja kies 1 zo niet kies 2: ");
					try {
						keuze = s.nextInt();
						if (keuze > 2 || keuze < 1) {
							throw new IllegalArgumentException();
						}
						stop = false;
					} catch (IllegalArgumentException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					} catch (InputMismatchException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					}
				} while (stop);

				teller++;
				if (teller <= 4 && teller < 2 && keuze == 2)
					System.out.println("Onvoldoende spelers toegevoegd");
				spelers.add(speler);
			} while (keuze == 1);
		} while (teller <= 4 && teller < 2);
		System.out.println("Er is een nieuw spel gerigstreerd");
	}

	public void speelSpel() {
		dc.bepaalStartSpeler();
		int teller = 0;

		do {
			System.out.println();
			System.out.println("----------------------");
			System.out.println("Overzicht van het spel");
			System.out.println("----------------------");
			System.out.println(dc.toonOverzichtSpel());
			System.out.println();

			System.out.println("----------------------");
			System.out.println("Overzicht per speler");
			System.out.println("----------------------");
			System.out.println(dc.toonOverzichtPerSpeler());
			System.out.println();

			System.out.printf("%s is aan de beurt%n%n", dc.getSpelerAanDeBeurt().getGebruikersnaam());

			int actie = vraagActie();

			switch (actie) {
			case 1 -> {
				System.out.println("Beschikbare edelsteenfiches:");
				System.out.println(dc.toonOverzichtBeschikbareEdelsteenfiches());
				neemEdelsteenfiches();
			}
			case 2 -> {
				System.out.println("Beschikbare ontwikkelingskaarten:");
				System.out.println(dc.toonOverzichtBischikbareOntwikkelingskaarten());
				koopOntwikkelingskaart();
			}
			case 3 -> {
				System.out.println("Je beurt wordt overgeslaan");
			}
			}
			if (!dc.getOntwikkelingskaartenInBezitSpelerAanDeBeurt().isEmpty()) {
				specialeTegel();
			}

			dc.bepaalSpelerAanDeBeurt();

			teller++;
			if (!dc.isEinde()) {
				if (teller == dc.getSpelers().size())
					teller = 0;
			}
		} while (teller < dc.getSpelers().size() && !dc.isEinde());

		System.out.println();
		System.out.println("Het spel is beeindigd");
		System.out.println("----------------------");
		System.out.println(dc.geefScoreOverzicht());
		System.out.println();

		for (Speler speler : dc.geefWinnaar()) {
			System.out.printf("%s is gewoonen%n", speler.getGebruikersnaam());
		}
	}

	public void koopOntwikkelingskaart() {
		int keuze = 0, niveau = 0, prestigePunten = 0;
		Edelsteenfiche bonus = null;
		List<Edelsteenfiche> kostprijs = new ArrayList<>();
		boolean stop = true;

		do {
			do {
				try {
					System.out.println("Welke niveau heeft de kaart?");
					niveau = s.nextInt();
					if (niveau < 1 || niveau > 3)
						throw new IllegalArgumentException("niveau moet tussen 1 t.e.m. 3 liggen");
					stop = false;
				} catch (IllegalArgumentException i) {
					System.out.println(i.getMessage());
					s.nextLine();
				} catch (InputMismatchException in) {
					System.out.println("niveau moet tussen 1 t.e.m. 3 liggen");
					s.nextLine();
				}
			} while (stop);

			stop = true;
			do {
				try {
					System.out.println("Welke bonus bevat de kaart?");
					String bonusString = s.next();
					bonus = new Edelsteenfiche(bonusString);
					stop = false;
				} catch (IllegalArgumentException il) {
					System.out.println(il.getMessage());
					s.nextLine();
				}
			} while (stop);

			do {
				stop = true;
				do {
					try {
						System.out.println("Welke kostprijs bevat de kaart (geef een edelsteenfiche) ?");
						String soort = s.next();
						Edelsteenfiche prijs = new Edelsteenfiche(soort);
						kostprijs.add(prijs);
						stop = false;
					} catch (IllegalArgumentException il) {
						System.out.println(il.getMessage());
						s.nextLine();
					}
				} while (stop);

				stop = true;
				do {
					try {
						System.out.println("Wilt u de kostprijs verder aanvullen? 1: ja, 2: nee");
						keuze = s.nextInt();
						if (keuze < 1 || keuze > 2) {
							throw new IllegalArgumentException();
						}
						stop = false;
					} catch (IllegalArgumentException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					} catch (InputMismatchException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					}
				} while (stop);
			} while (keuze != 2);

			stop = true;
			do {
				try {
					System.out.println("Hoeveel prestigepunten bevat de kaart?");
					prestigePunten = s.nextInt();
					if (prestigePunten < 0 || prestigePunten > 5)
						throw new IllegalArgumentException("aantal prestige punten moet tussen 0 t.e.m. 5 liggen");
					stop = false;
				} catch (InputMismatchException i) {
					System.out.println(i.getMessage());
					s.nextLine();
				}
			} while (stop);

			Ontwikkelingskaart ontw = new Ontwikkelingskaart(niveau, bonus, kostprijs, prestigePunten);

			stop = true;
			try {
				dc.koopOntwikkelingskaart(ontw);
				stop = false;
			} catch (IllegalArgumentException il) {
				System.out.println(il.getMessage());
				niveau = 0;
				bonus = null;
				kostprijs.clear();
				prestigePunten = 0;
			}
		} while (stop);
	}

	public void neemEdelsteenfiches() {
		boolean stop = true;
		do {
			List<Edelsteenfiche> edelsteenfiches = new ArrayList<>(
					vraagEdelsteenfichesOp("Welk edelsteenfiche wenst u te nemen?",
							"Wil je nog een edelsteenfiche nemen? typ 1 (ja), 2 (nee)"));

			try {
				dc.neemEdelsteenfiche(edelsteenfiches);
				stop = false;
			} catch (IllegalArgumentException e) {
				System.out.println(e.getMessage());
				edelsteenfiches.clear();
			}
		} while (stop);

		stop = true;
		if (dc.controleerAantalEdelsteenfichesInVoorraad()) {
			System.out.println(dc.toonOverzichtEdelsteenfichesInVoorraadSpeler());
			do {
				List<Edelsteenfiche> edelsteenfiches = new ArrayList<>(
						vraagEdelsteenfichesOp("Welk edelsteenfiche wenst u terug te geven?",
								"Wil je nog een edelsteenfiche teruggeven? typ 1 (ja), 2 (nee)"));

				try {
					dc.geefEdelsteenfichesTerug(edelsteenfiches);
					stop = false;
				} catch (IllegalArgumentException e) {
					System.out.println(e.getMessage());
					edelsteenfiches.clear();
				}
			} while (stop);

		}
	}

	public List<Edelsteenfiche> vraagEdelsteenfichesOp(String message1, String message2) {
		boolean stop = true;
		List<Edelsteenfiche> edelsteenfiches = new ArrayList<>();
		int keuze = 0;

		do {

			do {
				try {
					System.out.println(message1);
					String soort = s.next();
					Edelsteenfiche edelsteenfiche = new Edelsteenfiche(soort);
					stop = false;
					edelsteenfiches.add(edelsteenfiche);
				} catch (IllegalArgumentException e) {
					System.out.println(e.getMessage());
					s.nextLine();
				}
			} while (stop);

			stop = true;
			do {
				try {
					System.out.println(message2);
					keuze = s.nextInt();
					if (keuze < 1 || keuze > 2) {
						throw new IllegalArgumentException();
					}
					stop = false;
				} catch (IllegalArgumentException e) {
					System.out.println("Ongeldige keuze, kies 1 of 2");
					s.nextLine();
				} catch (InputMismatchException e) {
					System.out.println("Ongeldige keuze, kies 1 of 2");
					s.nextLine();
				}
			} while (stop);

		} while (keuze != 2);
		return edelsteenfiches;
	}

	public int vraagActie() {
		int keuze = 0;
		boolean stop = true;
		do {
			System.out.println(
					"Kies 1 om edelsteenfiches te nemen - Kies 2 om een ontwikkelingskaart te kopen - Kies 3 om je beurt over te slaan");
			try {
				keuze = s.nextInt();
				if (keuze < 1 || keuze > 3) {
					throw new IllegalArgumentException("Kies een geldige optie (1, 2 of 3)");
				}
				stop = false;
			} catch (InputMismatchException e) {
				System.out.println("Ongeldige keuze, kies 1, 2 of 3");
				s.nextLine();
			} catch (IllegalArgumentException e) {
				System.out.println(e.getMessage());
				s.nextLine();
			}
		} while (stop);
		return keuze;
	}

	public void specialeTegel() {
		boolean stop = true;
		int prestigePunten = 0, kostprijsToevoegen = 0;
		List<Edelsteenfiche> kostprijs = new ArrayList<>();

		System.out.println(dc.toonBeschikbareSpecialeTegels());

		if (!dc.toonBeschikbareSpecialeTegels().equals("geen beschikbare speciale tegels")) {
			do {
				try {
					System.out.println("Hoeveel prestigepunten bevat de kaart?");
					prestigePunten = s.nextInt();
					if (prestigePunten < 0 || prestigePunten > 5)
						throw new IllegalArgumentException("aantal prestige punten moet tussen 0 t.e.m. 5 liggen");
					stop = false;
				} catch (IllegalArgumentException il) {
					System.out.println(il.getMessage());
					s.nextLine();
				} catch (InputMismatchException i) {
					System.out.println(i.getMessage());
					s.nextLine();
				}
			} while (stop);

			do {
				stop = true;
				do {
					try {
						System.out.println("Welke kostprijs bevat de kaart (geef een edelsteenfiche) ?");
						String soort = s.next();
						Edelsteenfiche prijs = new Edelsteenfiche(soort);
						kostprijs.add(prijs);
						stop = false;
					} catch (IllegalArgumentException il) {
						System.out.println(il.getMessage());
						s.nextLine();
					}
				} while (stop);

				do {
					System.out.println("Wilt u opnieuw een kostprijs ingeven? 1: ja, 2: nee");
					try {
						kostprijsToevoegen = s.nextInt();
						if (kostprijsToevoegen > 2 || kostprijsToevoegen < 1) {
							throw new IllegalArgumentException();
						}
						stop = false;
					} catch (IllegalArgumentException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					} catch (InputMismatchException e) {
						System.out.println("Ongeldige keuze, kies 1 of 2");
						s.nextLine();
					}
				} while (stop);
			} while (kostprijsToevoegen != 2);

			Edele ed = new Edele(prestigePunten, kostprijs);
			dc.kiesSpecialeTegel(ed);
		} else {
			System.out.println("Je hebt niet het correcte aantal ontwikkelingskaarten om een edele te kopen");
		}
	}
}
