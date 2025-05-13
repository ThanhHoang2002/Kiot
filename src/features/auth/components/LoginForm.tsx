import { Eye, EyeOff, Loader2, User, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../apis/login';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginFormValues } from '../schema/login.schema';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginBackground } from '@/assets/images';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  // Initialize form with react-hook-form
  const {handleSubmit, formState: { errors }, register} = useLoginForm()

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {

    try {
      setIsLoading(true);
      setLoginError(null);
      const response = await login(data.username, data.password);
      localStorage.setItem('accessToken', response);
      navigate('/');
    } catch (error) {
      setLoginError('Tài khoản hoặc mật khẩu không đúng vui lòng thử lại!');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ backgroundImage: `url(${loginBackground})` }}>
      <Card className="w-full max-w-md rounded-lg pb-5 shadow-lg">
        <CardHeader className="space-y-1 pb-8 pt-6 text-center">       
          <CardTitle className="text-2xl font-bold">Chào mừng trở lại</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 px-6">
          {loginError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500" role="alert">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tài khoản
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    className={`pl-10 ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Vui lòng nhập tài khoản"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Vui lòng nhập mật khẩu"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đăng nhập ...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </div>
          </form>
        </CardContent>        
      </Card>
    </div>
  );
};

export default LoginForm;