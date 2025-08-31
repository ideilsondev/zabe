import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QComboBox, QPushButton, QTextEdit
from jose import jwt
from datetime import datetime, timedelta

class JWTGeneratorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("JWT Generator")
        self.setGeometry(100, 100, 600, 400)
        self.init_ui()

    def init_ui(self):
        # Main widget and layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)

        # Secret Key Input
        key_layout = QHBoxLayout()
        key_label = QLabel("Secret Key:")
        self.key_input = QLineEdit()
        self.key_input.setPlaceholderText("Enter your secret key")
        key_layout.addWidget(key_label)
        key_layout.addWidget(self.key_input)
        layout.addLayout(key_layout)

        # Algorithm Selection
        algo_layout = QHBoxLayout()
        algo_label = QLabel("Algorithm:")
        self.algo_combo = QComboBox()
        self.algo_combo.addItems(["HS256", "HS384", "HS512"])
        algo_layout.addWidget(algo_label)
        algo_layout.addWidget(self.algo_combo)
        layout.addLayout(algo_layout)

        # Expiration Time Input
        exp_layout = QHBoxLayout()
        exp_label = QLabel("Expiration (minutes):")
        self.exp_input = QLineEdit()
        self.exp_input.setPlaceholderText("Enter expiration time in minutes")
        exp_layout.addWidget(exp_label)
        exp_layout.addWidget(self.exp_input)
        layout.addLayout(exp_layout)

        # Generate Button
        self.generate_btn = QPushButton("Generate JWT")
        self.generate_btn.clicked.connect(self.generate_jwt)
        layout.addWidget(self.generate_btn)

        # Output Display
        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        layout.addWidget(self.output_text)

    def generate_jwt(self):
        try:
            # Get inputs
            secret_key = self.key_input.text().strip()
            algorithm = self.algo_combo.currentText()
            exp_minutes = self.exp_input.text().strip()

            # Validate inputs
            if not secret_key:
                self.output_text.setText("Error: Secret key is required.")
                return
            if not exp_minutes.isdigit():
                self.output_text.setText("Error: Expiration time must be a number.")
                return

            exp_minutes = int(exp_minutes)
            if exp_minutes <= 0:
                self.output_text.setText("Error: Expiration time must be positive.")
                return

            # Create payload
            issued_at = datetime.utcnow()
            expiration = issued_at + timedelta(minutes=exp_minutes)
            payload = {
                "sub": "user123",  # Example subject
                "iat": int(issued_at.timestamp()),
                "exp": int(expiration.timestamp())
            }

            # Generate JWT
            token = jwt.encode(payload, secret_key, algorithm=algorithm)
            self.output_text.setText(f"Generated JWT:\n{token}")

        except Exception as e:
            self.output_text.setText(f"Error: {str(e)}")

if __name__ == "__main__":
    # pip install pyqt5==5.15.9 python-jose==3.3.0
    app = QApplication(sys.argv)
    window = JWTGeneratorApp()
    window.show()
    sys.exit(app.exec_())