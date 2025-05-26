package domein;

import java.util.List;
import java.util.ListIterator;
import java.util.Objects;

public class Ontwikkelingskaart {

	private int niveau;
	private int prestigePunten;
	private Edelsteenfiche bonus;
	private List<Edelsteenfiche> kostprijs;

	public Ontwikkelingskaart(int niveau, Edelsteenfiche bonus, List<Edelsteenfiche> kostprijs, int prestigePunten) {
		this.niveau = niveau;
		this.bonus = bonus;
		this.kostprijs = kostprijs;
		setPrestigePunten(prestigePunten);
	}

	public int getNiveau() {
		return this.niveau;
	}

	public Edelsteenfiche getBonus() {
		return this.bonus;
	}

	public List<Edelsteenfiche> getKostprijs() {
		return this.kostprijs;
	}

	public int getAantalPrestigePunten() {
		return this.prestigePunten;
	}

	private void setPrestigePunten(int punten) {
		if (punten < 0 || punten > 5)
			throw new IllegalArgumentException("aantal prestige punten moet tussen 1 t.e.m. 5 liggen");
		this.prestigePunten = punten;
	}

	public String toString() {
		String kostprijs = "";
		ListIterator<Edelsteenfiche> it = this.kostprijs.listIterator();
		while (it.hasNext()) {
			kostprijs += String.format("%s, ", it.next().getSoort());
		}

		return String.format("- bonus: %s - kostprijs: %s - prestige punten: %d%n ", this.bonus.getSoort(), kostprijs,
				this.prestigePunten);
	}

	@Override
	public int hashCode() {
		return Objects.hash(bonus, kostprijs, niveau, prestigePunten);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Ontwikkelingskaart other = (Ontwikkelingskaart) obj;
		return Objects.equals(bonus, other.bonus) && Objects.equals(kostprijs, other.kostprijs)
				&& niveau == other.niveau && prestigePunten == other.prestigePunten;
	}

}
