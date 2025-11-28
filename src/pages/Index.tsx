import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Crypto {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change: number;
  icon: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  crypto: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const cryptos: Crypto[] = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.0234, value: 2456.78, change: 5.2, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', balance: 1.543, value: 3890.45, change: -2.1, icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', balance: 5000, value: 5000, change: 0, icon: '₮' },
    { symbol: 'BNB', name: 'Binance', balance: 12.45, value: 4234.12, change: 3.8, icon: 'Ⓑ' },
  ];

  const totalBalance = cryptos.reduce((acc, crypto) => acc + crypto.value, 0);

  const transactions: Transaction[] = [
    { id: '1', type: 'receive', crypto: 'BTC', amount: 0.0123, date: '2025-11-28 14:30', status: 'completed' },
    { id: '2', type: 'send', crypto: 'ETH', amount: 0.543, date: '2025-11-27 09:15', status: 'completed' },
    { id: '3', type: 'swap', crypto: 'USDT→BNB', amount: 1000, date: '2025-11-26 18:45', status: 'completed' },
    { id: '4', type: 'receive', crypto: 'BNB', amount: 5.2, date: '2025-11-25 12:00', status: 'pending' },
  ];

  const generateSeedPhrase = () => {
    const words = [
      'quantum', 'stellar', 'nebula', 'cosmic', 'galaxy', 'orbit',
      'cipher', 'matrix', 'digital', 'crypto', 'secure', 'vault'
    ];
    const newPhrase = Array.from({ length: 12 }, () => 
      words[Math.floor(Math.random() * words.length)]
    );
    setSeedPhrase(newPhrase);
    setShowSeedPhrase(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-glow">
                <Icon name="Wallet" size={28} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-orbitron font-bold text-neon-cyan">CryptoVault</h1>
                <p className="text-sm text-muted-foreground">Футуристический кошелек</p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="glass-morphism border-primary/30">
              <Icon name="Settings" size={20} className="text-primary" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full glass-morphism p-1">
            <TabsTrigger value="wallet" className="data-[state=active]:neon-glow data-[state=active]:bg-primary/20">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="swap" className="data-[state=active]:neon-glow data-[state=active]:bg-primary/20">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Обмен
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:neon-glow data-[state=active]:bg-primary/20">
              <Icon name="Send" size={18} className="mr-2" />
              Вывод
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:neon-glow data-[state=active]:bg-primary/20">
              <Icon name="Clock" size={18} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6 animate-fade-in">
            <Card className="glass-morphism border-primary/30 p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Общий баланс</p>
                <h2 className="text-5xl font-orbitron font-bold text-neon-cyan mb-2">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p className="text-sm text-neon-green">+$234.56 (1.52%) сегодня</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button className="bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Пополнить
                </Button>
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-orbitron font-semibold text-foreground">Мои активы</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>
              <div className="grid gap-3">
                {cryptos.map((crypto) => (
                  <Card key={crypto.symbol} className="glass-morphism border-primary/20 p-4 hover:border-primary/50 transition-all cursor-pointer animate-slide-up">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl neon-glow">
                          {crypto.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{crypto.name}</h4>
                          <p className="text-sm text-muted-foreground">{crypto.balance} {crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${crypto.value.toLocaleString()}</p>
                        <p className={`text-sm ${crypto.change >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swap" className="space-y-6 animate-fade-in">
            <Card className="glass-morphism border-primary/30 p-6">
              <h3 className="text-xl font-orbitron font-semibold mb-6 text-neon-cyan">Обмен криптовалют</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Отдаете</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0.00" className="glass-morphism border-primary/30 flex-1" />
                    <select className="glass-morphism border-primary/30 rounded-lg px-4 bg-card text-foreground">
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>USDT</option>
                      <option>BNB</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button size="icon" variant="outline" className="rounded-full neon-glow-purple border-secondary">
                    <Icon name="ArrowDownUp" size={20} className="text-secondary" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Получаете</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0.00" className="glass-morphism border-primary/30 flex-1" />
                    <select className="glass-morphism border-primary/30 rounded-lg px-4 bg-card text-foreground">
                      <option>ETH</option>
                      <option>BTC</option>
                      <option>USDT</option>
                      <option>BNB</option>
                    </select>
                  </div>
                </div>

                <div className="glass-morphism border-secondary/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Курс обмена</span>
                    <span className="text-foreground">1 BTC = 15.234 ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Комиссия сети</span>
                    <span className="text-foreground">~$2.45</span>
                  </div>
                </div>

                <Button className="w-full bg-secondary text-secondary-foreground neon-glow-purple hover:bg-secondary/90">
                  Обменять
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="send" className="space-y-6 animate-fade-in">
            <Card className="glass-morphism border-primary/30 p-6">
              <h3 className="text-xl font-orbitron font-semibold mb-6 text-neon-cyan">Вывод средств</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Выберите криптовалюту</label>
                  <select className="w-full glass-morphism border-primary/30 rounded-lg px-4 py-3 bg-card text-foreground">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>Tether (USDT)</option>
                    <option>Binance (BNB)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Адрес получателя</label>
                  <div className="relative">
                    <Input 
                      placeholder="0x..." 
                      className="glass-morphism border-primary/30 pr-10"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Icon name="Scan" size={18} className="text-primary" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-muted-foreground">Сумма</label>
                    <span className="text-sm text-primary cursor-pointer">Максимум</span>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="glass-morphism border-primary/30"
                  />
                  <p className="text-xs text-muted-foreground">Доступно: 0.0234 BTC</p>
                </div>

                <div className="glass-morphism border-primary/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Комиссия сети</span>
                    <span className="text-foreground">~$1.23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Время подтверждения</span>
                    <span className="text-foreground">~10 минут</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-primary/20">
                    <span className="text-foreground">Итого к отправке</span>
                    <span className="text-neon-cyan">0.00 BTC</span>
                  </div>
                </div>

                <Button className="w-full bg-primary text-primary-foreground neon-glow hover:bg-primary/90">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-orbitron font-semibold text-foreground">История транзакций</h3>
                <Button variant="outline" size="sm" className="border-primary/30">
                  <Icon name="Filter" size={16} className="mr-2" />
                  Фильтр
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="glass-morphism border-primary/20 p-4 hover:border-primary/50 transition-all animate-slide-up">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'receive' ? 'bg-accent/20 neon-glow-green' :
                          tx.type === 'send' ? 'bg-destructive/20' :
                          'bg-secondary/20 neon-glow-purple'
                        }`}>
                          <Icon 
                            name={tx.type === 'receive' ? 'ArrowDown' : tx.type === 'send' ? 'ArrowUp' : 'ArrowLeftRight'} 
                            size={20} 
                            className={
                              tx.type === 'receive' ? 'text-accent' :
                              tx.type === 'send' ? 'text-destructive' :
                              'text-secondary'
                            }
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {tx.type === 'receive' ? 'Получено' : tx.type === 'send' ? 'Отправлено' : 'Обмен'}
                          </h4>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.type === 'receive' ? 'text-neon-green' : 'text-foreground'
                        }`}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.crypto}
                        </p>
                        <div className="flex items-center gap-2">
                          {tx.status === 'completed' ? (
                            <span className="text-xs text-neon-green">Завершено</span>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
                              В обработке
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="glass-morphism border-secondary/30 p-6 mt-8">
          <h3 className="text-xl font-orbitron font-semibold mb-6 text-neon-purple">Безопасность</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Создать новый кошелек</h4>
                <p className="text-sm text-muted-foreground mb-4">Сгенерируйте новую 12-словную сид-фразу</p>
                {!showSeedPhrase ? (
                  <Button 
                    onClick={generateSeedPhrase}
                    className="bg-secondary text-secondary-foreground neon-glow-purple hover:bg-secondary/90"
                  >
                    <Icon name="Key" size={18} className="mr-2" />
                    Создать сид-фразу
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {seedPhrase.map((word, index) => (
                        <div key={index} className="glass-morphism border-secondary/30 rounded p-2 text-center">
                          <span className="text-xs text-muted-foreground">{index + 1}.</span>
                          <span className="ml-1 text-sm font-mono text-neon-purple">{word}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-secondary/30"
                      onClick={() => navigator.clipboard.writeText(seedPhrase.join(' '))}
                    >
                      <Icon name="Copy" size={18} className="mr-2" />
                      Копировать
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Импорт кошелька</h4>
                <p className="text-sm text-muted-foreground mb-4">Восстановите доступ через сид-фразу</p>
                <div className="space-y-3">
                  <Input 
                    placeholder="Введите 12 слов через пробел..." 
                    className="glass-morphism border-primary/30"
                  />
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Icon name="Download" size={18} className="mr-2" />
                    Импортировать
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-primary/20">
            <h4 className="font-semibold text-foreground mb-4">Дополнительная защита</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between glass-morphism border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon name="Fingerprint" size={24} className="text-accent" />
                  <span className="text-sm text-foreground">Биометрия</span>
                </div>
                <div className="w-11 h-6 bg-accent rounded-full relative neon-glow-green">
                  <div className="w-5 h-5 bg-background rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between glass-morphism border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon name="Shield" size={24} className="text-primary" />
                  <span className="text-sm text-foreground">2FA защита</span>
                </div>
                <div className="w-11 h-6 bg-muted rounded-full relative">
                  <div className="w-5 h-5 bg-background rounded-full absolute top-0.5 left-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}