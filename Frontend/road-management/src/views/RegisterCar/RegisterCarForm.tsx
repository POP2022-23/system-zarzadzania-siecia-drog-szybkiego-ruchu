import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';

const RegisterCarForm: React.FC<{ checkNewCar: (registrationNumber: string, vin: string) => void }> = (props) => {
  const registrationNumberRef = useRef<HTMLInputElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const registrationNumber = registrationNumberRef.current!.value;
    const vin = vinRef.current!.value;
    props.checkNewCar(registrationNumber, vin);
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Form.Group controlId='registrationNumber'>
        <Form.Label>Podaj numer rejestracji:</Form.Label>
        <Form.Control type='text' required ref={registrationNumberRef} />
      </Form.Group>

      <Form.Group controlId='vin' className='mb-3'>
        <Form.Label>Podaj numer VIN:</Form.Label>
        <Form.Control type='text' required ref={vinRef} />
      </Form.Group>
      <Button type='submit'>Zarejestruj nowy pojazd</Button>
    </Form>
  );
};

export default RegisterCarForm;
