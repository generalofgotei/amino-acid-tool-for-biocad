import React, { useState } from 'react';

const App: React.FC = () => {
  const [sequenceOne, setSequenceOne] = useState('');
  const [sequenceTwo, setSequenceTwo] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showAlignment, setShowAlignment] = useState(false);

  const aminoAcidTypes: { [key: string]: string } = {
    // Цистеин - C
    'C': 'cysteine',
    // Гидрофобные - A, I, L, M, F, W, Y, V, P
    'A': 'hydrophobic', 'I': 'hydrophobic', 'L': 'hydrophobic', 'M': 'hydrophobic',
    'F': 'hydrophobic', 'W': 'hydrophobic', 'Y': 'hydrophobic', 'V': 'hydrophobic', 'P': 'hydrophobic',
    // Глицин - G
    'G': 'glycine',
    // Отрицательно заряженные - D, E
    'D': 'negative', 'E': 'negative',
    // Положительно заряженные - K, R
    'K': 'positive', 'R': 'positive',
    // Полярные незаряженные - S, T, H, Q, N
    'S': 'polar', 'T': 'polar', 'H': 'polar', 'Q': 'polar', 'N': 'polar',
    // Спейс
    '-': 'space'
  };

  const validAminoAcids = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V', '-'];

  const validateInput = (value: string): boolean => {
    return value.split('').every(char => validAminoAcids.includes(char.toUpperCase()));
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlignment(false);
    if (evt.target.name === 'sequenceOne') {
      setSequenceOne(evt.target.value)
    }
    if (evt.target.name === 'sequenceTwo') {
      setSequenceTwo(evt.target.value)
    }
  }
  
  const handleSubmit = () => {
    const newErrors: string[] = [];

    // Проверка обязательности заполнения
    if (!sequenceOne.trim() || !sequenceTwo.trim()) {
      newErrors.push('Обе последовательности обязательны для заполнения');
    }

    // Проверка валидности символов
    if (sequenceOne && !validateInput(sequenceOne)) {
      newErrors.push('Первая последовательность содержит недопустимые символы');
    }
    if (sequenceTwo && !validateInput(sequenceTwo)) {
      newErrors.push('Вторая последовательность содержит недопустимые символы');
    }

    // Проверка одинаковой длины
    if (sequenceOne && sequenceTwo && sequenceOne.length !== sequenceTwo.length) {
      newErrors.push('Последовательности должны быть одинаковой длины');
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setShowAlignment(true);
    } else {
      setShowAlignment(false);
    }
  };

  const getCharClass = (char: string, isSecond: boolean, otherChar?: string): string => {
    const baseClass = 'sequence__char';
    const aminoType = aminoAcidTypes[char] || 'space';
    const aminoClass = `sequence__char_amino_${aminoType}`;
    
    if (isSecond) {
      // Для второй последовательности показываем цвет только если символы различаются
      if (char !== otherChar) {
        return `${baseClass} ${aminoClass}`;
      }
      return baseClass;
    }
    
    return `${baseClass} ${aminoClass}`;
  };

  const renderSequence = (sequence: string, isSecond: boolean = false) => {
    const upperSequence = sequence.toUpperCase();
    const otherSequence = isSecond ? sequenceOne.toUpperCase() : sequenceTwo.toUpperCase();
    
    return upperSequence.split('').map((char, index) => {
      const charClass = getCharClass(char, isSecond, otherSequence[index]);
      
      return (
        <span key={index} className={charClass}>
          {char}
        </span>
      );
    });
  };


  return (
    <div className='page'>
      <div className='container'>
        <h1 className='title'>Инструмент для визуализации выравнивания аминокислотных последовательностей</h1>
        
        <div className='form'>
          <div className='input-group'>
            <label className='label'>
              Первая аминокислотная последовательность:
            </label>
            <input
              type='text'
              name='sequenceOne'
              value={sequenceOne}
              onChange={handleChange}
              className='input'
              placeholder='Введите аминокислотную последовательность (например: VLSPADKTNIKASWEKIGSHG)'
              required
            />
          </div>

          <div className='input-group'>
            <label className='label'>
              Вторая аминокислотная последовательность:
            </label>
            <input
              type='text'
              name='sequenceTwo'
              value={sequenceTwo}
              onChange={handleChange}
              className='input'
              placeholder='Введите аминокислотную последовательность'
              required
            />
          </div>

          {errors.length > 0 && (
            <div className='errors'>
              {errors.map((error, index) => (
                <div key={index} className='error'>
                  {error}
                </div>
              ))}
            </div>
          )}

          <button 
            type='button' 
            onClick={handleSubmit} 
            className='button button_type_submit'
          >
            Визуализация выравнивания
          </button>
        </div>

        {showAlignment && (
          <div className='alignment'>
            <h2 className='alignment__title'>
              Результат выравнивания последовательностей:
            </h2>
            <div className='alignment__display'>
              <div className='sequence'>
                {renderSequence(sequenceOne)}
              </div>
              <div className='sequence'>
                {renderSequence(sequenceTwo, true)}
              </div>
            </div>
          </div>
        )}

        <div className='legend'>
          <h3 className='legend__title'>
            Цветовая схема (легенда):
          </h3>
          <div className='legend__list'>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_cysteine'></span>
              <span className='legend__text'>Цистеин — C</span>
            </div>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_hydrophobic'></span>
              <span className='legend__text'>Гидрофобные — A, I, L, M, F, W, Y, V, P</span>
            </div>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_glycine'></span>
              <span className='legend__text'>Глицин — G</span>
            </div>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_negative'></span>
              <span className='legend__text'>Отрицательно заряженные — D, E</span>
            </div>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_positive'></span>
              <span className='legend__text'>Положительно заряженные — K, R</span>
            </div>
            <div className='legend__item'>
              <span className='legend__color legend__color_type_polar'></span>
              <span className='legend__text'>Полярные незаряженные — S, T, H, Q, N</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;