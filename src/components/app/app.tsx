import React, { useState } from 'react';

const App: React.FC = () => {
  const [sequenceOne, setSequenceOne] = useState('');
  const [sequenceTwo, setSequenceTwo] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showAlignment, setShowAlignment] = useState(false);

  const aminoAcidTypes: { [key: string]: string } = {
    'C': 'cysteine',
    'A': 'hydrophobic', 'I': 'hydrophobic', 'L': 'hydrophobic', 'M': 'hydrophobic',
    'F': 'hydrophobic', 'W': 'hydrophobic', 'Y': 'hydrophobic', 'V': 'hydrophobic', 'P': 'hydrophobic',
    'G': 'glycine',
    'D': 'negative', 'E': 'negative',
    'K': 'positive', 'R': 'positive',
    'S': 'polar', 'T': 'polar', 'H': 'polar', 'Q': 'polar', 'N': 'polar',
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

    if (!sequenceOne.trim() || !sequenceTwo.trim()) {
      newErrors.push('Обе последовательности обязательны для заполнения');
    }

    if (sequenceOne && !validateInput(sequenceOne)) {
      newErrors.push('Первая последовательность содержит недопустимые символы');
    }
    if (sequenceTwo && !validateInput(sequenceTwo)) {
      newErrors.push('Вторая последовательность содержит недопустимые символы');
    }

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
      if (char !== otherChar) {
        return `${baseClass} ${aminoClass}`;
      }
      return baseClass;
    }
    
    return `${baseClass} ${aminoClass}`;
  };

  const renderAlignment = () => {
    const upperSequenceOne = sequenceOne.toUpperCase();
    const upperSequenceTwo = sequenceTwo.toUpperCase();
    
        const getCharsPerLine = () => {
      if (window.innerWidth <= 320) return 10;
      if (window.innerWidth <= 480) return 15;
      if (window.innerWidth <= 768) return 20;
      return 30;
    };
    
    const charsPerLine = getCharsPerLine();
    const blocks = [];
    
    for (let i = 0; i < upperSequenceOne.length; i += charsPerLine) {
      const block1 = upperSequenceOne.slice(i, i + charsPerLine);
      const block2 = upperSequenceTwo.slice(i, i + charsPerLine);
      
      blocks.push({
        sequenceOne: block1,
        sequenceTwo: block2,
        startIndex: i
      });
    }
    
    return blocks.map((block, blockIndex) => (
      <div key={blockIndex} className='sequence-block'>
        <div className='sequence'>
          {block.sequenceOne.split('').map((char, charIndex) => {
            const globalIndex = block.startIndex + charIndex;
            const charClass = getCharClass(char, false);
            
            return (
              <span key={globalIndex} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>
        
        <div className='sequence sequence_type_second'>
          {block.sequenceTwo.split('').map((char, charIndex) => {
            const globalIndex = block.startIndex + charIndex;
            const otherChar = block.sequenceOne[charIndex];
            const charClass = getCharClass(char, true, otherChar);
            
            return (
              <span key={globalIndex} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
    ));
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
              {renderAlignment()}
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