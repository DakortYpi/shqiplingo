// Client-side AI Tutor Service compatible with static GitHub Pages hosting

export interface TutorResponse {
  content: string;
  translationDe: string;
  grammarFeedback?: string;
}

export function getTutorReply(scenarioId: string, userText: string): TutorResponse {
  const lower = userText.toLowerCase().trim();

  if (scenarioId === 'cafe-tirana') {
    if (lower.includes('kafe') || lower.includes('ekspres') || lower.includes('makiato') || lower.includes('ujë')) {
      return {
        content: 'Patjetër! Një kafe ekspres dhe ujë i ftohtë po vijnë menjëherë. A dëshironi sheqer?',
        translationDe: 'Selbstverständlich! Ein Espresso und kaltes Wasser kommen sofort. Wünschen Sie Zucker?',
        grammarFeedback: 'Tipp: "po vijnë" drückt die Verlaufsform (Gegenwart im Verlauf) aus.',
      };
    }
    if (lower.includes('çaj') || lower.includes('limon')) {
      return {
        content: 'Kemi çaj mali me limon dhe mjaltë shumë të mirë! Po jua sjell pas një minute.',
        translationDe: 'Wir haben sehr guten Bergtee mit Zitrone und Honig! Ich bringe ihn Ihnen gleich.',
        grammarFeedback: 'Tipp: "Çaj mali" (Bergtee) ist die albanische Nationalspezialität.',
      };
    }
    if (lower.includes('fatur') || lower.includes('sa kushton') || lower.includes('lek') || lower.includes('kartë') || lower.includes('para')) {
      return {
        content: 'Gjithsej kushton 150 lekë, ju lutem. Mund të paguani me para në dorë ose me kartë.',
        translationDe: 'Insgesamt macht das 150 Lek, bitte. Sie können bar oder mit Karte bezahlen.',
        grammarFeedback: 'Gut gemacht! "Faturën, ju lutem" ist die perfekte Redewendung.',
      };
    }
    return {
      content: 'Mirë se erdhët! Kemi kafe shumë të shijshme dhe trileçe të freskët. Çfarë preferoni të porosisni?',
      translationDe: 'Willkommen! Wir haben sehr leckeren Kaffee und frischen Trileçe. Was möchten Sie bestellen?',
      grammarFeedback: 'Tipp: "ëmbëlsira" (Süßspeisen) ist feminin Plural.',
    };
  }

  if (scenarioId === 'intro-hostel') {
    if (lower.includes('quhem') || lower.includes('jam') || lower.includes('arben') || lower.includes('max')) {
      return {
        content: 'Gëzohem shumë që u njohëm! Gjermania është vend shumë i bukur. Sa kohë do të qëndrosh në Shqipëri?',
        translationDe: 'Ich freue mich sehr, dich kennenzulernen! Deutschland ist ein sehr schönes Land. Wie lange wirst du in Albanien bleiben?',
        grammarFeedback: 'Super Satz! "Gëzohem që u njohëm" ist die herzliche Floskel für "Freut mich!".',
      };
    }
    if (lower.includes('shkodr') || lower.includes('qytet') || lower.includes('vend')) {
      return {
        content: 'Shkodra ka një kështjellë fantastike të quajtur Rozafa dhe liqen madhështor. Duhet ta vizitosh patjetër!',
        translationDe: 'Shkodra hat eine fantastische Burg namens Rozafa und einen wunderschönen See. Du musst sie unbedingt besuchen!',
        grammarFeedback: 'Tipp: "kështjellë" = Burg, "liqen" = See.',
      };
    }
    return {
      content: 'Shqipja jote po përmirësohet çdo ditë! Me kë ke udhëtuar këtu në Shqipëri?',
      translationDe: 'Dein Albanisch verbessert sich jeden Tag! Mit wem bist du hier nach Albanien gereist?',
      grammarFeedback: 'Tipp: "Me kë" = Mit wem.',
    };
  }

  if (scenarioId === 'bazar-kruja') {
    if (lower.includes('sa kushton') || lower.includes('çmim')) {
      return {
        content: 'Ky qilim është punim dore me lesh natyral, kushton 3000 lekë. Për ty po të bëj pak zbritje!',
        translationDe: 'Dieser Teppich ist Handarbeit aus reiner Wolle, er kostet 3000 Lek. Für dich gebe ich etwas Rabatt!',
        grammarFeedback: 'Tipp: "zbritje" bedeutet Preisnachlass / Rabatt.',
      };
    }
    return {
      content: 'Mirë se vjen në Krujë! Këto janë punime tradicionale të punuara nga mjeshtrit tanë vendas.',
      translationDe: 'Willkommen in Kruja! Dies sind traditionelle Arbeiten, gefertigt von unseren lokalen Handwerksmeistern.',
      grammarFeedback: 'Tipp: "mjeshtrit vendas" = die einheimischen Meister.',
    };
  }

  if (scenarioId === 'history-kruja') {
    if (lower.includes('skënderbeu') || lower.includes('skanderbeg') || lower.includes('kush')) {
      return {
        content: 'Skënderbeu bashkoi princat shqiptarë në Besëlidhjen e Lezhës më 1444 dhe fitoi 25 beteja.',
        translationDe: 'Skanderbeg vereinte die albanischen Fürsten 1444 im Bund von Lezha und gewann 25 Schlachten.',
        grammarFeedback: 'Tipp: "fitoi" ist der Aorist (Vergangenheit) von "fitoj" (siegen).',
      };
    }
    if (lower.includes('shqiponj') || lower.includes('flamur') || lower.includes('dy')) {
      return {
        content: 'Shqiponja e zezë me dy krena vjen nga stema e Kastriotëve dhe simbolizon lirinë dhe vigjilencën.',
        translationDe: 'Der schwarze Doppeladler stammt aus dem Wappen der Kastrioti und symbolisiert Freiheit und Wachsamkeit.',
        grammarFeedback: 'Tipp: "dy krena" bedeutet zwei Köpfe / Häupter.',
      };
    }
    if (lower.includes('besa') || lower.includes('nder')) {
      return {
        content: 'Besa është kodi më i lartë i nderit. Shqiptari e mban fjalën e dhënë me çdo kusht!',
        translationDe: 'Besa ist der höchste Ehrenkodex. Der Albaner hält sein gegebenes Wort um jeden Preis!',
        grammarFeedback: 'Tipp: "fjala e dhënë" = das gegebene Wort.',
      };
    }
    return {
      content: 'Kalaja e Krujës ka mbijetuar rrethime madhore. Këtu historia ndihet në çdo gur!',
      translationDe: 'Die Burg von Kruja überstand historische Belagerungen. Hier spürt man Geschichte in jedem Stein!',
      grammarFeedback: 'Tipp: "në çdo gur" = in jedem Stein.',
    };
  }

  if (scenarioId === 'pazari-tirana') {
    if (lower.includes('sa kushton') || lower.includes('çmim') || lower.includes('moll')) {
      return {
        content: 'Mollët e kuqe janë 120 lekë për kilogram, shumë të ëmbla nga Korça! Sa kilogramë të peshoj?',
        translationDe: 'Die roten Äpfel kosten 120 Lek pro Kilo, sehr süß aus Korça! Wie viel Kilo soll ich Ihnen abwiegen?',
        grammarFeedback: 'Tipp: "nga Korça" = aus Korça (bekannte Obstregion Albaniens).',
      };
    }
    if (lower.includes('zbritje') || lower.includes('lirë') || lower.includes('shumë')) {
      return {
        content: 'Nëse merr dy kilogramë mollë dhe domate, po t\'i bëj me zbritje për 300 lekë!',
        translationDe: 'Wenn Sie zwei Kilo Äpfel und Tomaten nehmen, gebe ich Rabatt für 300 Lek!',
        grammarFeedback: 'Tipp: "me zbritje" = mit Rabatt.',
      };
    }
    if (lower.includes('kusur') || lower.includes('mbaj') || lower.includes('lek')) {
      return {
        content: 'Faleminderit shumë mik! Ditën e mirë dhe punë të mbarë!',
        translationDe: 'Vielen Dank, mein Freund! Einen schönen Tag und gutes Gelingen!',
        grammarFeedback: 'Tipp: "Punë të mbarë!" wünscht man arbeitenden Menschen.',
      };
    }
    return {
      content: 'Kemi perime dhe fruta të freskëta vendase. Çfarë dëshironi tjetër?',
      translationDe: 'Wir haben frisches einheimisches Obst und Gemüse. Was wünschen Sie noch?',
      grammarFeedback: 'Tipp: "vendase" = einheimisch / lokal.',
    };
  }

  return {
    content: 'Ju mirëkuptoj shumë mirë! Vazhdo kështu, po mëson shkëlqyeshëm.',
    translationDe: 'Ich verstehe Sie sehr gut! Weiter so, du lernst hervorragend.',
    grammarFeedback: 'Albanisch klingt schon sehr flüssig!',
  };
}
