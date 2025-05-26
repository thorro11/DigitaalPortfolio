package persistentie;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import domein.Speler;

public class SpelerMapper {

	public Speler geefSpeler(String gebruikersnaam, int geboortejaar) {
		Speler speler = null;
		try (Connection conn = DriverManager.getConnection(Connectie.JDBC_URL);
				PreparedStatement query = conn.prepareStatement(
						"SELECT * FROM ID399880_g55.Spelers WHERE gebruikersnaam = ? AND geboortejaar = ?")) {
			query.setString(1, gebruikersnaam);
			query.setInt(2, geboortejaar);

			try (ResultSet rs = query.executeQuery()) {
				if (rs.next()) {
					String naam = rs.getString("gebruikersnaam");
					int gbjaar = rs.getInt("geboortejaar");
					speler = new Speler(naam, gbjaar);
				} else {
					throw new IllegalArgumentException("Speler bevind zich niet in de databank");
				}
			}
		} catch (SQLException ex) {
			throw new RuntimeException(ex);
		}

		return speler;
	}
}
