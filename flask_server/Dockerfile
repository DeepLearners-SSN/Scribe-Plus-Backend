FROM python

COPY ./requirements.txt  /app/requirements.txt

ENV PORT=5000
WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 5000

CMD ["python","app.py"]