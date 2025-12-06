import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Operator = '+' | '-' | 'X' | '/' | null;

export default function Index() {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);

  const handleNumberPress = (digit: string) => {
    setDisplay((current) => {
      if (waitingForNewValue || current === '0') {
        setWaitingForNewValue(false);
        return digit;
      }
      return current + digit;
    });
  };

  const handleDot = () => {
    setDisplay((current) => {
      if (waitingForNewValue) {
        setWaitingForNewValue(false);
        return '0.';
      }
      if (current.includes('.')) return current;
      return current + '.';
    });
  };

  const doCalculation = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case 'X':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const handleOperatorPress = (op: Operator) => {
    const current = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = doCalculation(prevValue, current, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEquals = () => {
    if (operator === null || prevValue === null) return;

    const current = parseFloat(display);
    const result = doCalculation(prevValue, current, operator);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    setDisplay((current) => {
      if (waitingForNewValue) return current;
      if (current.length <= 1) return '0';
      return current.slice(0, -1);
    });
  };

  const handlePlusMinus = () => {
    setDisplay((current) => {
      if (current === '0') return current;
      if (current.startsWith('-')) return current.slice(1);
      return '-' + current;
    });
  };

  const handlePercent = () => {
    setDisplay((current) => String(parseFloat(current) / 100));
  };

  // ===== RENDER JEDNEGO PRZYCISKU =====
  const renderButton = (label: string, onPress: () => void, type: 'num' | 'op' = 'num') => {
    const isOp = type === 'op';
    return (
      <TouchableOpacity
        key={label}
        style={[styles.button, isOp ? styles.buttonOp : styles.buttonNum]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {/* Pasek "index" masz automatycznie w Expo Routerze */}

        {/* Wyświetlacz */}
        <View style={styles.displayContainer}>
          <Text style={styles.displayText} numberOfLines={1}>
            {display}
          </Text>
        </View>

        {/* Rzędy przycisków – jak na screenie */}
        <View style={styles.keypad}>
          {/* Rząd 1 */}
          <View style={styles.row}>
            {renderButton('<=', handleBackspace, 'op')}
            {renderButton('+/-', handlePlusMinus, 'op')}
            {renderButton('%', handlePercent, 'op')}
            {renderButton('/', () => handleOperatorPress('/'), 'op')}
          </View>

          {/* Rząd 2 */}
          <View style={styles.row}>
            {renderButton('7', () => handleNumberPress('7'))}
            {renderButton('8', () => handleNumberPress('8'))}
            {renderButton('9', () => handleNumberPress('9'))}
            {renderButton('X', () => handleOperatorPress('X'), 'op')}
          </View>

          {/* Rząd 3 */}
          <View style={styles.row}>
            {renderButton('4', () => handleNumberPress('4'))}
            {renderButton('5', () => handleNumberPress('5'))}
            {renderButton('6', () => handleNumberPress('6'))}
            {renderButton('-', () => handleOperatorPress('-'), 'op')}
          </View>

          {/* Rząd 4 */}
          <View style={styles.row}>
            {renderButton('1', () => handleNumberPress('1'))}
            {renderButton('2', () => handleNumberPress('2'))}
            {renderButton('3', () => handleNumberPress('3'))}
            {renderButton('+', () => handleOperatorPress('+'), 'op')}
          </View>

          {/* Rząd 5 */}
          <View style={styles.row}>
            {renderButton('ops', handleClearAll)}
            {renderButton('0', () => handleNumberPress('0'))}
            {renderButton('.', handleDot)}
            {renderButton('=', handleEquals, 'op')}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 12,
  },
  displayContainer: {
    height: 70,
    backgroundColor: '#cbe4ff', // jasnoniebieski jak na screenie
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  displayText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  keypad: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 4,
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonNum: {
    backgroundColor: '#8ecbff',
  },
  buttonOp: {
    backgroundColor: '#ffa531', 
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
