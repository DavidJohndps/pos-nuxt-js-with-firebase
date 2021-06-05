export default function ({$fire, redirect}) {
    // If the user is not authenticated
    if(!$fire.auth.currentUser) return redirect('/Login')
    // if (!fire.auth.currentUser) {
    //   return redirect('/login')
    // }
  }