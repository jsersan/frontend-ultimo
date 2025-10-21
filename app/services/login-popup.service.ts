// src/app/services/login-popup.service.ts - ARCHIVO COMPLETO

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginPopupService {
  // ✅ Estado del popup
  private _isVisible = new BehaviorSubject<boolean>(false);
  private _returnUrl = new BehaviorSubject<string>('/');
  private _fromCheckout = new BehaviorSubject<boolean>(false);
  
  // ✅ Observables públicos
  public isVisible$ = this._isVisible.asObservable();
  public returnUrl$ = this._returnUrl.asObservable();
  public fromCheckout$ = this._fromCheckout.asObservable();
  
  // ✅ Evento para comunicación
  private _loginSuccessEvent = new Subject<any>();
  public loginSuccess$ = this._loginSuccessEvent.asObservable();

  constructor(private router: Router) {
    console.log('🔧 LoginPopupService inicializado');
  }

  // ✅ Abrir popup para checkout
  openForCheckout(returnUrl: string = '/checkout'): void {
    console.log('🛒 Abriendo popup para checkout:', returnUrl);
    
    this._returnUrl.next(returnUrl);
    this._fromCheckout.next(returnUrl.includes('checkout'));
    this._isVisible.next(true);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  // ✅ Abrir popup general
  open(returnUrl: string = '/'): void {
    console.log('🔓 Abriendo popup de login:', returnUrl);
    
    this._returnUrl.next(returnUrl);
    this._fromCheckout.next(false);
    this._isVisible.next(true);
    
    document.body.style.overflow = 'hidden';
  }

  // ✅ Cerrar popup
  close(): void {
    console.log('❌ Cerrando popup de login');
    
    this._isVisible.next(false);
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  // ✅ Notificar login exitoso Y redirigir
  notifyLoginSuccess(user: any): void {
    console.log('✅ Login exitoso notificado:', user.username);
    this._loginSuccessEvent.next(user);
    
    // ✅ Redirigir automáticamente después del login
    const returnUrl = this._returnUrl.value;
    if (returnUrl && returnUrl !== '/') {
      console.log('🎯 Redirigiendo automáticamente a:', returnUrl);
      
      // Pequeño delay para que se complete el cierre del popup
      setTimeout(() => {
        this.router.navigate([returnUrl]);
        // Ahora sí resetear
        this._returnUrl.next('/');
        this._fromCheckout.next(false);
      }, 500);
    } else {
      // Si no hay returnUrl específico, resetear inmediatamente
      this._returnUrl.next('/');
      this._fromCheckout.next(false);
    }
  }

  // ✅ Getters para valores actuales
  get isVisible(): boolean {
    return this._isVisible.value;
  }

  get returnUrl(): string {
    return this._returnUrl.value;
  }

  get fromCheckout(): boolean {
    return this._fromCheckout.value;
  }

  // ✅ Método de utilidad para debug
  getState(): any {
    return {
      isVisible: this.isVisible,
      returnUrl: this.returnUrl,
      fromCheckout: this.fromCheckout
    };
  }
}