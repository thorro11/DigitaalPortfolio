import joblib
import pandas as pd

final_model_reloaded = joblib.load("kwh_voorspellingen_model.pkl")

weather = pd.read_csv('./forecast(in).csv')

weather['timestamp'] = pd.to_datetime(weather['timestamp'])
weather['Year'] = weather['timestamp'].dt.year
weather['Day'] = weather['timestamp'].dt.day
weather['Month'] = weather['timestamp'].dt.month
weather['Hour'] = weather['timestamp'].dt.hour
weather.drop('timestamp', axis=1, inplace=True)

sunrise_sunset = pd.read_excel('./datasets/sunrise-sunset.xlsx')

sunrise_sunset['datum'] = pd.to_datetime(sunrise_sunset['datum'])
sunrise_sunset['Year'] = sunrise_sunset['datum'].dt.year
sunrise_sunset['Day'] = sunrise_sunset['datum'].dt.day
sunrise_sunset['Month'] = sunrise_sunset['datum'].dt.month

sunrise_sunset['Opkomst'] = pd.to_datetime(sunrise_sunset['Opkomst'], format='%H:%M:%S')
sunrise_sunset['Opkomst Uur'] = sunrise_sunset['Opkomst'].dt.hour
sunrise_sunset['Opkomst Minuut'] = sunrise_sunset['Opkomst'].dt.minute
sunrise_sunset['Op ware middag'] = pd.to_datetime(sunrise_sunset['Op ware middag'], format='%H:%M:%S')
sunrise_sunset['Op ware middag Uur'] = sunrise_sunset['Op ware middag'].dt.hour
sunrise_sunset['Op ware middag Minuut'] = sunrise_sunset['Op ware middag'].dt.minute
sunrise_sunset['Ondergang'] = pd.to_datetime(sunrise_sunset['Ondergang'], format='%H:%M:%S')
sunrise_sunset['Ondergang Uur'] = sunrise_sunset['Ondergang'].dt.hour
sunrise_sunset['Ondergang Minuut'] = sunrise_sunset['Ondergang'].dt.minute

sunrise_sunset.drop('Opkomst',axis=1,inplace=True)
sunrise_sunset.drop('Op ware middag',axis=1,inplace=True)
sunrise_sunset.drop('Ondergang',axis=1,inplace=True)

sunrise_sunset.drop('datum', axis=1, inplace=True)

df = weather.merge(sunrise_sunset, how='left', on=['Year','Day','Month'])
df.drop('Year',axis=1,inplace=True)
df.rename(columns={'pressure':'pressure_station_level'},inplace=True)

kwh = final_model_reloaded.predict(df)

for i in range(len(df)):
  print(f"Voorspelling voor {df.iloc[i,df.columns.get_loc('Hour')]}u: {kwh[i]:.2f} kWh")

