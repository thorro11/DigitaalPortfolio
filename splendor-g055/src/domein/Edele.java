package domein;

import java.util.List;
import java.util.ListIterator;
import java.util.Objects;

public class Edele {

	private int prestigePunten;
	private List<Edelsteenfiche> kostprijs;

	public Edele(int prestigePunten, List<Edelsteenfiche> kostprijs) {
		this.prestigePunten = prestigePunten;
		this.kostprijs = kostprijs;
	}

	public List<Edelsteenfiche> getKostprijs() {
		return kostprijs;
	}

	public int getPrestigePunten() {
		return prestigePunten;
	}

	public String toString() {
		String kostprijs = "";
		ListIterator<Edelsteenfiche> it = this.kostprijs.listIterator();
		while (it.hasNext()) {
			kostprijs += String.format("%s, ", it.next().getSoort());
		}
		return String.format("prestige punten: %d - kostprijs: %s%n", this.getPrestigePunten(), kostprijs);
	}

	@Override
	public int hashCode() {
		return Objects.hash(kostprijs, prestigePunten);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Edele other = (Edele) obj;
		return Objects.equals(kostprijs, other.kostprijs) && prestigePunten == other.prestigePunten;
	}

}
