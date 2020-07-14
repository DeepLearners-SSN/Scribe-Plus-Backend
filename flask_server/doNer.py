import requests


def doNer(text, url='https://bern.korea.ac.kr/plain'):

    ner = requests.post(url, data={'sample_text': text}).json()

    outputJSON = {'disease': [], 'drug': [], 'symptoms': []}

    for i in ner['denotations']:
        if i['obj'] == 'disease':
            outputJSON['disease'].append(
                text[i['span']['begin']:i['span']['end']])
        if i['obj'] == 'drug':
            outputJSON['drug'].append(
                text[i['span']['begin']:i['span']['end']])

    return outputJSON
