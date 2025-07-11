"""Создание таблиц

Revision ID: 36274700c7a7
Revises: 
Create Date: 2025-05-11 13:47:02.795246

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '36274700c7a7'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('category_id'),
    sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_categories_category_id'), 'categories', ['category_id'], unique=False)
    op.create_table('employees',
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('position', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('phone', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('employee_id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('phone')
    )
    op.create_index(op.f('ix_employees_employee_id'), 'employees', ['employee_id'], unique=False)
    op.create_table('payment_methods',
    sa.Column('payment_method_id', sa.Integer(), nullable=False),
    sa.Column('method_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('payment_method_id'),
    sa.UniqueConstraint('method_name')
    )
    op.create_table('roles',
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.Column('role_name', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('role_id'),
    sa.UniqueConstraint('role_name')
    )
    op.create_index(op.f('ix_roles_role_id'), 'roles', ['role_id'], unique=False)
    op.create_table('stores',
    sa.Column('store_id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('store_id')
    )
    op.create_index(op.f('ix_stores_store_id'), 'stores', ['store_id'], unique=False)
    op.create_table('products',
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('barcode', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.category_id'], ),
    sa.PrimaryKeyConstraint('product_id')
    )
    op.create_index(op.f('ix_products_barcode'), 'products', ['barcode'], unique=True)
    op.create_index(op.f('ix_products_product_id'), 'products', ['product_id'], unique=False)
    op.create_table('supplies',
    sa.Column('supply_id', sa.Integer(), nullable=False),
    sa.Column('store_id', sa.Integer(), nullable=False),
    sa.Column('supply_date', sa.DATE(), nullable=False),
    sa.Column('supplier_name', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['store_id'], ['stores.store_id'], ),
    sa.PrimaryKeyConstraint('supply_id')
    )
    op.create_index(op.f('ix_supplies_supply_id'), 'supplies', ['supply_id'], unique=False)
    op.create_table('users',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=True),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.employee_id'], ),
    sa.ForeignKeyConstraint(['role_id'], ['roles.role_id'], ),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_user_id'), 'users', ['user_id'], unique=False)
    op.create_table('sales',
    sa.Column('sale_id', sa.Integer(), nullable=False),
    sa.Column('sale_datetime', sa.DATETIME(), nullable=True),
    sa.Column('total_amount', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('store_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['store_id'], ['stores.store_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('sale_id')
    )
    op.create_table('stocks',
    sa.Column('stock_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('store_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('stock_date', sa.DATE(), nullable=True),
    sa.Column('updated_datetime', sa.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.product_id'], ),
    sa.ForeignKeyConstraint(['store_id'], ['stores.store_id'], ),
    sa.PrimaryKeyConstraint('stock_id')
    )
    op.create_index(op.f('ix_stocks_stock_id'), 'stocks', ['stock_id'], unique=False)
    op.create_table('supply_items',
    sa.Column('supply_item_id', sa.Integer(), nullable=False),
    sa.Column('supply_id', sa.Integer(), nullable=True),
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('received_quantity', sa.Integer(), nullable=True),
    sa.Column('is_received', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.product_id'], ),
    sa.ForeignKeyConstraint(['supply_id'], ['supplies.supply_id'], ),
    sa.PrimaryKeyConstraint('supply_item_id')
    )
    op.create_table('payments',
    sa.Column('payment_id', sa.Integer(), nullable=False),
    sa.Column('sale_id', sa.Integer(), nullable=False),
    sa.Column('payment_method_id', sa.Integer(), nullable=True),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('payment_datetime', sa.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['payment_method_id'], ['payment_methods.payment_method_id'], ),
    sa.ForeignKeyConstraint(['sale_id'], ['sales.sale_id'], ),
    sa.PrimaryKeyConstraint('payment_id')
    )
    op.create_table('sale_items',
    sa.Column('sale_item_id', sa.Integer(), nullable=False),
    sa.Column('sale_id', sa.Integer(), nullable=True),
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('price', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.product_id'], ),
    sa.ForeignKeyConstraint(['sale_id'], ['sales.sale_id'], ),
    sa.PrimaryKeyConstraint('sale_item_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('sale_items')
    op.drop_table('payments')
    op.drop_table('supply_items')
    op.drop_index(op.f('ix_stocks_stock_id'), table_name='stocks')
    op.drop_table('stocks')
    op.drop_table('sales')
    op.drop_index(op.f('ix_users_user_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_supplies_supply_id'), table_name='supplies')
    op.drop_table('supplies')
    op.drop_index(op.f('ix_products_product_id'), table_name='products')
    op.drop_index(op.f('ix_products_barcode'), table_name='products')
    op.drop_table('products')
    op.drop_index(op.f('ix_stores_store_id'), table_name='stores')
    op.drop_table('stores')
    op.drop_index(op.f('ix_roles_role_id'), table_name='roles')
    op.drop_table('roles')
    op.drop_table('payment_methods')
    op.drop_index(op.f('ix_employees_employee_id'), table_name='employees')
    op.drop_table('employees')
    op.drop_index(op.f('ix_categories_category_id'), table_name='categories')
    op.drop_table('categories')
    # ### end Alembic commands ###
