import requests


def doNer(text, url='https://bern.korea.ac.kr/plain'):

    ner = requests.post(url, data={'sample_text': text}).json()

    outputJSON = {}
    disease = []
    drug = []
    symptoms = []

    for i in ner['denotations']:
        if i['obj'] == 'disease':
            disease.append(text[i['span']['begin']:i['span']['end']])
        if i['obj'] == 'drug':
            drug.append(text[i['span']['begin']:i['span']['end']])

    diseaseString = convertToString(disease)
    drugString = convertToString(drug)
    outputJSON['disease'] = diseaseString
    outputJSON['drug'] = drugString
    outputJSON['symptoms'] = ""

    return outputJSON


def convertToString(items):
    x = ""
    for item in items:
        x += item + ", "

    return x[:-2]
