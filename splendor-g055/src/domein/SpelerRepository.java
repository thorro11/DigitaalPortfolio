package domein;

import persistentie.SpelerMapper;

public class SpelerRepository {
	private final SpelerMapper mapper;

	public SpelerRepository() {
		mapper = new SpelerMapper();

	}

	public Speler haalSpelerOp(String gebruikersnaam, int geboortejaar) {
		Speler s = mapper.geefSpeler(gebruikersnaam, geboortejaar);
		return s;
	}

}
