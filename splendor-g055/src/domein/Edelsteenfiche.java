package domein;

import java.util.Objects;

public class Edelsteenfiche {

	private String soort;

	public Edelsteenfiche(String soort) {
		this.soort = soort;
	}

	public String getSoort() {
		return this.soort;
	}

	@Override
	public int hashCode() {
		return Objects.hash(soort);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Edelsteenfiche other = (Edelsteenfiche) obj;
		return Objects.equals(soort, other.soort);
	}

}
