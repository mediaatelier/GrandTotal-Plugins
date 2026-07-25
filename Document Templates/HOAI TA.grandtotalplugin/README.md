# HOAI Technische Ausrüstung — Hinweise

## Leistungsphasen & Leistungsstand gelten global für alle Anlagengruppen

Das Plugin wendet die gewählten Leistungsphasen und den Leistungsstand **einheitlich auf alle Anlagengruppen** an.

In der Praxis kann das abweichen:

- **Beauftragter Umfang (welche LPH):** oft vertragsweit gleich für alle beauftragten Anlagengruppen — meist unkritisch.
- **Leistungsstand:** bei Abschlags-/Teilrechnungen läuft der Fortschritt je Gewerk auseinander (z. B. Starkstrom-Ausführung fertig, Förderanlagen noch nicht begonnen).
- Gelegentlich ist auch der Umfang je Gruppe verschieden (nur eine Gruppe mit Objektüberwachung LPH 8).

„Alle Gruppen identisch" ist also **nicht** die sichere Annahme — vor allem beim Leistungsstand.

## Abweichungen nachträglich in GrandTotal korrigieren

Die erzeugten Positionen sind vollwertige, editierbare Zeilen je Anlagengruppe (unter der jeweiligen Zusammenfassung / `SummaryCost`):

- **Nicht beauftragte Phase** einer Gruppe → Zeile löschen.
- **Abweichender Leistungsstand** → `Menge` der Phasenzeile anpassen. Die Menge ist der Anteil am Gruppen-Basiswert in Prozent = LPH-Satz × Leistungsstand.
  Beispiel: LPH 5 (22 %) bei 50 % Stand → Menge `11`.

## Mögliche Erweiterung (bewusst zurückgestellt)

Leistungsstand — und ggf. die Phasenauswahl — pro Anlagengruppe direkt im Plugin-UI setzbar machen. Zurückgestellt, um die UI schlank zu halten.
