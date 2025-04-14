FROM python:3.12.3

WORKDIR /backend
COPY ./requirements.lock /backend/
RUN sed '/-e/d' requirements.lock > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /backend

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
